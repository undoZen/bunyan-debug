require('../replaceConsole')('logger-test');
console.time('hello');
console.log('hello');
console.info('world');
console.trace('hello, %s', 'world');
console.dir({
    hello: 'world'
});
setTimeout(function () {
    console.timeEnd('hello');
}, 1000);
