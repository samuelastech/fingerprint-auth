const User = require('../models/User')

class UserController {
  /**
   * Create a user in the database
   */
  create = async (req, res) => {
    try {
      const fingerprint = req.file
      if (!fingerprint) throw new Error('you must provide a fingerprint')

      const user = {
        ...JSON.parse(JSON.stringify(req.body)),
        fingerprint: {
          data: fingerprint.buffer,
          contentType: fingerprint.mimetype
        }
      }

      await User.create(user)

      res.json({
        status: true,
        message: 'user created'
      })
    } catch (error) {
      switch (error.message) {
        case 'you must provide a fingerprint':
          return res.status(401).json({
            status: false,
            message: error.message
          })

        default:
          return res.status(500).json({
            status: false,
            message: 'internal server error',
            errorName: error.name,
            errorMessage: error.message
          })
      }
    }
  }
}

module.exports = new UserController()
