const express = require('express')
const router = express.Router()

/**
 * Middlewares
 */
const session = require('../middlewares/session')

router.get('/information/2', session.cookie, (req, res) => {
  const { accessLevel } = req.user

  // Unauthorized
  if (accessLevel < 2) {
    handleUnauthorized(res, [2, 3], accessLevel)
  }

  return res.render('info/2')
})

router.get('/information/3', session.cookie, (req, res) => {
  const { accessLevel } = req.user

  // Unauthorized
  if (accessLevel < 3) {
    return handleUnauthorized(res, [3], accessLevel)
  }

  return res.render('info/3')
})

/**
 * Handle unauthorized access level
 * @param {Array} requiredAccess access that can view the info -- [2, 3] [3]
 * @param {Number} userAccess current user's access
 * @returns {Object} response to the user
 */
function handleUnauthorized (res, requiredAccess, userAccess) {
  return res.status(401).json({
    status: false,
    message: 'user not authorized to access this information',
    requiredAccessLevel: requiredAccess,
    yourAccessLevel: userAccess
  })
}

module.exports = router
