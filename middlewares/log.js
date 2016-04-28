'use strict'

module.exports = function* log (next) {
  console.log(this.moduleName)
  console.log('I am time middleware.')
  yield next
}
