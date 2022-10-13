const index = require('./index')
const users = require('./users')
const login = require('./login')

module.exports = (app) => {
  app.use(
    index,
    users,
    login
  )
}
