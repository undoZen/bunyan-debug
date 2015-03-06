require('../replaceConsole')('dp:');
console.log('hello');
console.info('world');
console.trace('hello, %s', 'world');
console.dir({
    hello: 'world'
});
