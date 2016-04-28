'use strict'

const koaBody = require('koa-body')
    , path = require('path')
    , debug = require('debug')('middlewares')
    , settings = require('./app.conf.g.json')
    , serve = require('koa-static')

module.exports = function(app) {
  debug('加载中间件')

  // koa body
  app.use(
    koaBody(
      {
        formidable: {
          uploadDir: path.join(__dirname, settings.upLoadDir)
        }
      }
    )
  )

  // serve static files
  app.use(serve(path.join(__dirname, 'public', 'assets')))
}
