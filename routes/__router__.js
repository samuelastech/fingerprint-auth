const index = require('./index')
const users = require('./users')

module.exports = (app) => {
  app.use(
    index,
    users
  )
}
