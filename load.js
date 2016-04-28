'use strict'

let appGlobalConfig = require('./app.conf.g.json')
  , debug = require('debug')('load')
  , walk = require('walk')
  , path = require('path')
  , fs = require('fs')

module.exports = function(build) {
  let _appRoot = appGlobalConfig['modules'] || 'modules'
  let walker = walk.walk(path.join(__dirname, _appRoot))

  _bindWalkerEvents(walker)

  function _loadModule(moduleName) {
    return fs.existsSync(moduleName)
         ? require(moduleName)
         : false
  }

  function _bindWalkerEvents(walker) {
    walker.on('directories', function(root, dirStatsArray) {
      let _modules = dirStatsArray

      for(let i = 0;i<_modules.length;i++) {
        let _currentModule = _modules[i].name
        debug(`尝试加载${root}/${_currentModule}子模块`)

        let _childModuleConfig = _loadModule(
          path.join(root, _currentModule, 'app.conf.json')
        )
          , _childModuleControllers = _loadModule(
            path.join(root, _currentModule, 'controllers.js')
          )

        if(
          _childModuleConfig.active
          && _childModuleConfig
          && _childModuleControllers
        ) {
          build(
            _childModuleConfig.routes,
            _childModuleControllers,
            _currentModule,
            path.join(root, _currentModule),
            _childModuleConfig
          )
        }
      }
    })
  }
}
