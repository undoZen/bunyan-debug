'use strict';
var logger = require('./index');

var replaced;
module.exports = function replaceDebug(app) {
    if (replaced) return;
    replaced = true;

    function _debug(name) {
        var log = logger({
            app: app,
            name: name,
        });
        return log.trace.bind(log);
    }

    var Module = module.constructor;
    var nativeLoad = Module._load;
    Module._load = function (request, parent, isMain) {
        if (request === 'debug') {
            // exports
            return _debug
        }
        return nativeLoad.apply(this, arguments);
    };
};
