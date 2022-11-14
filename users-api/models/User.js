const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fingerprint: { type: String },
  accessLevel: { type: Number, enum: [1, 2, 3], required: true }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
