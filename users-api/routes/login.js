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

router.get('/login', (req, res) => res.render('login'))
router.post('/login', [fingerprint.verify, upload.single('fingerprint')], Auth.login)

module.exports = router
