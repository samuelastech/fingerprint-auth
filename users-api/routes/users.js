const express = require('express')
const router = express.Router()

/**
 * Controllers
 */
const User = require('../controllers/userController')

/**
 * Middlewares
 */
const upload = require('../middlewares/multer')

router.post('/users', upload.single('fingerprint'), User.create)
router.get('/users', User.list)
router.get('/clean', User.cleanUp)

module.exports = router
