const mongoose = require('mongoose')

const resetSchema = mongoose.Schema({
  token: { type: String },
  userId: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('jreset', resetSchema)
