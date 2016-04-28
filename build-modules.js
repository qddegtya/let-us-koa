'use strict'

const routesReg = /((.*)\|)?(GET|POST|PUT|DELETE)\#(.*)\#(.*)/i
    , debug = require('debug')('build')
    , middlewares = require('./middleware')
    , render = require('koa-swig')
    , path = require('path')
    , settings = require('./app.conf.g.json')

module.exports = function(app, router) {

  // load app.
  return function(routes, ctrls, modulePrefix, moduleRootDir, childModuleConf) {

    debug(`成功加载子模块: ${modulePrefix}, 子模块根目录: ${moduleRootDir}`)

    // build routes.
    function _buildRoute(routes, ctrls) {
      for(let i = 0;i < routes.length;i++) {
        let _routeMatch = routesReg.exec(routes[i])
          , middlewares = _routeMatch[2] ? _routeMatch[2].split('|') : []
          , _httpMethod = _routeMatch[3]
          , _routePath = _routeMatch[4]
          , _ctrlName = _routeMatch[5]

        let _modulePath = function(path) {
          let _path = path
          if(path === '/') {
            _path = ''
          }
          return '/'
                 + modulePrefix
                 + _path
        }

        let _routerMethod = _httpMethod.toLowerCase()
        debug('router对应方法: ', _routerMethod)

        // debug
        debug(`匹配路由 ${_modulePath(_routePath)} 控制器方法 ${_ctrlName} http method ${_httpMethod}`)

        // check controller.
        if(ctrls[_ctrlName] === (void 0)) {
          throw new Error(`${_ctrlName} must be defined in app.conf.json.`)
        }

        let mountModuleName = function* (next) {
          // 挂载模块名
          // 你可以用它来做些有用的事情
          this.moduleName = modulePrefix
          yield next
        }

        let renderMiddleware = function* (next) {
          // 挂载render
          this.render = render(Object.assign({
            root: path.join(moduleRootDir, settings.subModuleViewPathName || 'views')
          }, settings.renderSettings))
          yield next
        }

        let applyArgs = []
        .concat(_modulePath(_routePath))
        .concat(mountModuleName)
        .concat(middlewares.map(function(mid) {
          try {
            return (
              require(
                path.join(
                  __dirname,
                  settings.middlewareDir || 'middlewares'
                  , mid
                )
              )
            )
          } catch(e) {
            throw new Error('Can not find middleware ' + mid)
          }
        }))
        .concat(childModuleConf['needRender'] ? renderMiddleware : [])
        .concat(ctrls[_ctrlName])

        // debug
        debug(applyArgs.map(function(fn) {
          return typeof fn === 'function'
          ? fn.name === ''
          ? 'RouterLevel Middleware Function'
          : fn.name
          : fn
        }))

        // router it.
        router[_routerMethod].apply(router, applyArgs)
      }
    }

    // use koa-router
    function _route(app) {
      _buildRoute(routes, ctrls)
      app
        .use(router.routes())
        .use(router.allowedMethods())
    }

    // middlewares
    middlewares(app)

    // route
    _route(app)
  }

}
