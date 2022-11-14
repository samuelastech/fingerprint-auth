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

router.get('/auth', (req, res) => res.render('form'))
router.post('/auth', [upload.single('fingerprint'), fingerprint.verify, fingerprint.match], Auth.login)

module.exports = router
