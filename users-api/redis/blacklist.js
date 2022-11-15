const redis = require('redis')
const port = process.env.PORT_REDIS
const ADDR_REDIS = process.env.ADDR_REDIS

const client = redis.createClient(port, ADDR_REDIS, { prefix: 'blacklist:' })

module.exports = client
