# bunyan-hub-logger
This module is a high level module to be used with [bunyan-hub](https://undozen.github.io/bunyan-hub) to play as a drop in replacement to tj's debug module and serve as a logging module for your iojs/node.js project.

## install

You should have bunyan-hub installed globally first, then start it.

```bash
npm i -g bunyan-hub
bunyanhub start
```

then install `bunyan-hub-logger` in you iojs project (or node.js project, not tested) locally

```bash
npm i --save bunyan-hub-logger
```

## usage

### logger

```javascript
var logger = require('bunyan-hub-logger');

var log = logger('web')
// log object here is a bunyan logger with the name 'web'
log.trace('log trace')
log.debug({req: req}, 'debug http request');

/* logger options
logger(object opts) or logger(string opts)
logger({
    name: 'api', // currently debugging/logging module of your app/project
    app: 'project-a', // your app/project name
    serializers: {} // bunyan serializers, defaults to a modified bunyan.stdSerializers which append a `uuid.v4()` to req.req_id and res.req.req_id for req and res
});
if opts object is string it will be convert to { name: opts }
*/
```

You need specified app name in `app` and module name in `name` since bunyan-hub is serving as a centralized log aggregator, it will recieve logs from multiple running apps. `name` is like namespace in tj's debug module, and different app may use the same module name for the same or different module (e.g. `request` namespace in frontend app and backend app...)

### debug (from tj) replacement

```javascript
require('bunyan-hub-logger/replaceDebug')(appname);
```

for example you drop a line `require('bunyan-hub-logger/replaceDebug')('web-a');` in your `web-a` app, and it using [superagent](https://github.com/visionmedia/superagent) as http requesting module, then you will see logging records `{"name": "superagent", "app": "web-a", ... }` in bunyan-web or bunyan-sub, since superagent using debug module under namespace "superagent"

### console replacement

```javascript
require('bunyan-hub-logger/replaceDebug')(appname);
```

like replaceDebug, this will replace `console` object to send log to bunyan-hub.

## license
MIT
