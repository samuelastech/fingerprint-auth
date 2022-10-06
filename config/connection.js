const mongoose = require('mongoose')
const connectionString = process.env.CONNECTION_STRING

mongoose.connect(connectionString)

module.exports = mongoose.connection
