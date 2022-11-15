const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = {
  cookie: async (req, res, next) => {
    const accessToken = req.cookies.Authorization
    if (!accessToken) {
      res.render('form')
    }

    const secret = process.env.SECRET_PASS
    const decoded = jwt.verify(accessToken, secret)
    const user = await User.findById(decoded.id)
    req.user = user
    next()
  }
}
