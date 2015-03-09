'use strict';
var bunyan = require('bunyan');
var uuid = require('uuid');
var assign = require('lodash.assign');
var env = process.env.NODE_ENV || 'development';
var PubStream = require('bunyan-pub-stream');

var stdSerializers = Object.create(bunyan.stdSerializers);
exports.stdSerializers = stdSerializers;
stdSerializers.req = function (req) {
    if (!req || !req.connection) {
        return req;
    }
    if (!req.req_id) {
        req.req_id = uuid.v4();
    }
    return assign({}, bunyan.stdSerializers.req(req), {
        req_id: req.req_id
    });
};
stdSerializers.res = function (res) {
    if (res && res.req) {
        return assign({}, bunyan.stdSerializers.res(res), {
            req_id: stdSerializers.req(res.req).req_id
        });
    } else {
        return bunyan.stdSerializers.res(res);
    }
};

exports = module.exports = function (opts) {
    opts = typeof opts === 'string' ? {
        name: opts
    } : opts || {};
    var ss = stdSerializers;
    if (opts.stdSerializers) {
        ss = Object.create(stdSerializers);
        assign(ss, opts.stdSerializers);
    }
    var level = 'development' === env ?
        (opts.developmentLevel ? opts.developmentLevel : 'trace') :
        (opts.productionLevel ? opts.productionLevel : 'debug');
    var streams = [{
        level: level,
        stream: new PubStream(),
    }];
    var name = opts.namePrefix ? opts.namePrefix + opts.name : opts.name;
    return bunyan.createLogger({
        name: name,
        serializers: ss,
        streams: streams
    });
}

exports.replaceDebug = require('./replaceDebug');
exports.replaceConsole = require('./replaceConsole');
