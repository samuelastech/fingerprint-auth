const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = {
  cookie: async (req, res, next) => {
    try {
      const accessToken = req.cookies.Authorization
      if (!accessToken) {
        res.redirect('auth')
      }

      const secret = process.env.SECRET_PASS
      const decoded = jwt.verify(accessToken, secret)
      const user = await User.findById(decoded.id)
      req.user = user
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.redirect('auth')
      }
    }
  }
}
