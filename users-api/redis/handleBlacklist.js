const blacklist = require('./blacklist')

const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')

const { promisify } = require('util')
const existsAsync = promisify(blacklist.exists).bind(blacklist)
const setAsync = promisify(blacklist.set).bind(blacklist)

/**
 * Generate a hash from the token to save it in the database
 * So, it's easier to organize, since the token is proportional to its payload
 * @param {String} token
 */
function tokenHash (token) {
  return createHash('sha256')
    .update(token)
    .digest('hex')
}

/**
 * Add a token in the database
 * @param {String} token
 */
async function add (token) {
  const expiration = jwt.decode(token).exp
  const hash = tokenHash(token)
  await setAsync(hash, '')
  blacklist.expireat(hash, expiration)
}

/**
 * Verify if there's the token in the database
 * @param {String} token
 * @returns {Boolean}
 */
async function has (token) {
  const hash = tokenHash(token)
  const result = await existsAsync(hash)
  return result === 1
}

module.exports = { add, has }
