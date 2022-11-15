const User = require('../models/User')
const jwt = require('jsonwebtoken')

class Auth {
  login = async (req, res) => {
    const user = await User.findById(req.user)
    const accessToken = this.#generateJWT(user)
    res.cookie('Authorization', accessToken)
    res.redirect('home')
  }

  /**
   * Generate a Token
   * @param {Object} user the authenticated user
   * @returns {String}
   */
  #generateJWT = (user) => {
    const payload = { id: user.id }
    const secretPass = process.env.SECRET_PASS
    const token = jwt.sign(payload, secretPass, { expiresIn: '15m' })
    return token
  }

  /**
     * Verify if a token is valid
     * @param {String} token
     * @returns {Object} associated user
     */
  static #verifyToken = (token) => {
    if (!token) throw new Error('token is not present')
    const secret = process.env.SECRET_PASS
    return jwt.verify(token, secret)
  }
}

module.exports = new Auth()
