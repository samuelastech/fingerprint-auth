const axios = require('axios')

module.exports = {
  verify: async (req, res, next) => {
    const fingerprint = req.file.buffer.toString('base64')

    try {
      await axios.post('http://localhost:5000/validate', {
        image: fingerprint
      })

      next()
    } catch (error) {
      const { status, message, score } = error.response.data

      res.status(404).json({
        status,
        message,
        score
      })
    }
  },

  match: async (req, res, next) => {
    const fingerprint = req.file.buffer.toString('base64')

    try {
      const response = await axios.post('http://localhost:5000/authenticate', {
        image: fingerprint
      })

      const { user_id } = response.data.auth
      req.user = user_id
      next()
    } catch (error) {
      const { message } = error.response.data
      res.status(401).json({
        status: false,
        message
      })
    }
  }
}
