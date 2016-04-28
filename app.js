'use strict'

const koa = require('koa')
    , app = koa()
    , log = global.console.log.bind(console)
    , PORT = process.env.PORT || 3000
    , router = require('koa-router')()
    , modules = require('./build-modules')(app, router)
    , load = require('./load')

// load
load(modules)

app.listen(PORT)
log('server is running on port: %s', PORT)
