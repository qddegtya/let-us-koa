'use strict'

module.exports = {
  getApiVersion: function* () {
    this.body = {
      'version': 'v1'
    }
  }
}
