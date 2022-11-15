const index = require('./index')
const users = require('./users')
const login = require('./login')
const info = require('./information')

module.exports = (app) => {
  app.use(
    index,
    users,
    login,
    info
  )
}
