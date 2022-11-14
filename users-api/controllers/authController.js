class Auth {
  login = async (req, res) => {
    res.json({ message: 'User logged in!' })
    // const fingerprint = req.file.buffer.toString('base64')
    // console.log(fingerprint)
  }
}

module.exports = new Auth()
