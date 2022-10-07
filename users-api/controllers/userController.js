const User = require('../models/User')

class UserController {
  /**
   * Create a user in the database
   */
  create = async (req, res) => {
    try {
      const fingerprint = req.file.buffer.toString('base64')

      if (!fingerprint) throw new Error('you must provide a fingerprint')

      const user = {
        ...JSON.parse(JSON.stringify(req.body)),
        fingerprint
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

  /**
   * List all the users in the database
   */
  list = async (req, res) => {
    try {
      const users = await User.find()
      res.status(200).json({
        status: true,
        users
      })
    } catch (error) {

    }
  }
}

module.exports = new UserController()
