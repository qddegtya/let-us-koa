'use strict'

module.exports = function* time (next) {
  console.log(new Date())
  yield next
}
