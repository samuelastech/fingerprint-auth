const mongoose = require('mongoose')

/**
 * Connect to the mock database.
 * @param {String} databaseName
 */
const connect = async (databaseName) => {
  const url = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true })
  mongoose.connection.on('error', (error) => console.log("Database isn't connected :( \n\n", error))
}

/**
 * Drop and close database connection.
 */
const close = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

/**
 * Clear a collection by dropping it
 * @param {Object} model mongoose model
 */
const clear = async (model) => {
  await mongoose.connection.dropCollection(model)
}

module.exports = { connect, close, clear }
