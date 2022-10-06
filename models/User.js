const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fingerprint: { data: Buffer, contentType: String },
  accessLevel: { type: Number, enum: [1, 2, 2], required: true }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
