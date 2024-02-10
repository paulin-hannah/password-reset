const validator = require('validator')

module.exports = {
  isEmail: (email) => {
    return validator.isEmail(email)
  },

  isEmpty: (message) => {
    return validator.isEmpty(message)
  },
}
