const express = require('express')
const router = express.Router()

/**
 * Controllers
 */
const Auth = require('../controllers/authController')

/**
 * Middlewares
 */
const upload = require('../middlewares/multer')
const fingerprint = require('../middlewares/fingerprint')
const session = require('../middlewares/session')

router.get('/home', session.cookie, (req, res) => {
  const { username } = req.user
  res.render('home', { username })
})
router.get('/auth', (req, res) => res.render('form'))
router.post('/auth', [upload.single('fingerprint'), fingerprint.verify, fingerprint.match], Auth.login)
router.get('/logout', session.cookie, Auth.logout)

module.exports = router
