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
router.post('/auth', [fingerprint.verify, upload.single('fingerprint')], Auth.login)

module.exports = router
