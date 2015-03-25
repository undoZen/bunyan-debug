var log = require('../')({
    name: 'hello',
    app: 'logger-test'
});
//setTimeout(function () {
log.trace('log trace');
log.debug('log debug');
log.info('log info');
//}, 1000);
//
var log2 = require('../')('world');
//setTimeout(function () {
log2.trace('log trace');
log2.debug('log debug');
log2.info('log info');
//}, 1000);
