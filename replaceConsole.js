'use strict';
var logger = require('./index');
var util = require('util');
var Console = require('console').Console;

var replaced;
module.exports = function replaceDebug(app) {
    if (replaced) return;
    replaced = true;

    var log = logger({
        app: app,
        name: 'console'
    });

    function BunyanConsole(stdout, stderr) {
        if (!(this instanceof BunyanConsole)) {
            return new BunyanConsole(stdout, stderr);
        }
        Console.apply(this, arguments);
    }
    BunyanConsole.prototype = Object.create(Console);

    BunyanConsole.prototype.trace = function trace() {
        // copied from iojs source
        var err = new Error;
        err.name = 'Trace';
        err.message = util.format.apply(this, arguments);
        Error.captureStackTrace(err, trace);
        log.trace(err.stack); // modified this line
    };

    BunyanConsole.prototype.log = log.debug.bind(log);
    BunyanConsole.prototype.dir = function (object, options) {
        log.trace({
                object: object,
            },
            util.inspect(object, util._extend({
                customInspect: false
            }, options))
        );
    };
    BunyanConsole.prototype.info = log.info.bind(log);
    BunyanConsole.prototype.warn = log.warn.bind(log);
    BunyanConsole.prototype.error = log.error.bind(log);
    BunyanConsole.prototype.timeEnd = function (label) {
        var time = this._times.get(label);
        if (!time) {
            throw new Error('No such label: ' + label);
        }
        var duration = Date.now() - time;
        this.log({
            label: label,
            duration: duration
        }, '%s: %dms', label, duration);
    };

    var bc = new BunyanConsole({
        write: function () {}
    });

    for (var k in bc) {
        GLOBAL.console[k] = bc[k];
    }
};
