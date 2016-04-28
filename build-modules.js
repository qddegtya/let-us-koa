'use strict'

const routesReg = /(GET|POST|PUT|DELETE)\#(.*)\#(.*)/i
    , debug = require('debug')('build')
    , middlewares = require('./middleware')
    , render = require('koa-swig')
    , path = require('path')
    , settings = require('./app.conf.g.json')

module.exports = function(app, router) {

  // load app.
  return function(routes, ctrls, modulePrefix, moduleRootDir) {

    debug(`成功加载子模块: ${modulePrefix}, 子模块根目录: ${moduleRootDir}`)

    // build routes.
    function _buildRoute(routes, ctrls) {
      for(let i = 0;i < routes.length;i++) {
        let _routeMatch = routesReg.exec(routes[i])
          , _httpMethod = _routeMatch[1]
          , _routePath = _routeMatch[2]
          , _ctrlName = _routeMatch[3]

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

        // router it.
        router[_routerMethod](
          _modulePath(_routePath)
          , function* (next) {
            // 挂载模块名
            this.moduleName = modulePrefix
            // 挂载render方法
            this.render = render(Object.assign({
              root: path.join(moduleRootDir, 'views')
            }, settings.renderSettings))
            yield next
          }
          , ctrls[_ctrlName]
        )
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
