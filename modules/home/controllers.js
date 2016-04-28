'use strict'

module.exports = {
  getHomePage: function* () {
    yield this.render('index', {})
  }
}
