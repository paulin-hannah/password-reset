const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  uuid: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('juser', userSchema)
