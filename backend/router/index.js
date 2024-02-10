const router = require('express').Router()
const {
  v4: uuidv4,
  v5: uuidv5,
  version: uuidVersion,
  validate: uuidValidate,
} = require('uuid')
const { isEmail, isEmpty } = require('../helper')
const userModels = require('../models/user.models')
const resetModels = require('../models/reset.models')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const createError = require('http-errors')
const { resetHTML } = require('../helper/MailTemplate')
const {
  SECRET,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  DOMAIN_URL,
} = require('../config')

// Middleware to verify the token
function verifyToken(req, res, next) {
  // Getting the token from headers
  const bearerHeader = req.headers['authorization'] // Note: Headers are case-insensitive

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    jwt.verify(bearerToken, SECRET, (err, authData) => {
      if (err) {
        return res.status(401).send(createError.Unauthorized('Invalid token.'))
      } else {
        req.authData = authData
        next()
      }
    })
  } else {
    // If the header is not present, send a 403 Forbidden error
    return res.status(403).send(createError.Forbidden('Access denied.'))
  }
}

// validate the UUID 4
function uuidValidateV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4
}

// validate the UUID 5
function uuidValidateV5(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 5
}

// API
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation the user Input
    if (isEmpty(email))
      return res.status(400).send(createError.BadRequest('Email is required!'))

    if (isEmpty(password))
      return res
        .status(400)
        .send(createError.BadRequest('password is required!'))

    if (!isEmail(email))
      return res.status(400).send(createError.BadRequest('Invalid Email!'))

    // payload
    const payload = { uuid: uuidv4(), email, password }

    // save into DB
    const userSave = new userModels(payload)
    await userSave.save()

    return res.send({ message: 'Successful created' })
  } catch (error) {
    console.log('error-SERVER:', error.message)
    return res.status(500).send({ message: error.message })
  }
})

// API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation the user Input
    if (isEmpty(email))
      return res.status(400).send(createError.BadRequest('Email is required!'))

    if (isEmpty(password))
      return res
        .status(400)
        .send(createError.BadRequest('password is required!'))

    if (!isEmail(email))
      return res.status(400).send(createError.BadRequest('Invalid Email!'))

    const user = await userModels.findOne({ email })

    if (user && password === user.password) {
      const token = jwt.sign({ id: user.uuid }, SECRET, { expiresIn: '15m' })
      return res.status(200).send({ message: token })
    } else {
      // Authentication failed
      return res.status(400).send({ message: 'Wrong Credentials' })
    }
  } catch (error) {
    console.log('error-SERVER', error.message)
    return res.status(500).send({ message: error.message })
  }
})

// API
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body

    // Validation the user Input
    if (isEmpty(email))
      return res.status(400).send(createError.BadRequest('Email is required!'))

    if (!isEmail(email))
      return res.status(400).send(createError.BadRequest('Invalid Email!'))

    const user = await userModels.findOne({ email })

    if (!user) return res.status(404).send({ message: 'User not found' })

    // payload
    const payload = { userId: user.uuid, token: uuidv5(DOMAIN_URL, uuidv5.URL) }

    // save into DB
    const resetSave = new resetModels(payload)
    await resetSave.save()

    let transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: NODEMAILER_USER, // Your email address
        pass: NODEMAILER_PASSWORD, // Your email password
      },
    })

    let mailOptions = {
      from: NODEMAILER_USER, // Sender address
      to: user.email, // List of recipients
      subject: '[^_^] Reset Password', // Subject line
      html: resetHTML({
        sender: 'Admin',
        link: `${DOMAIN_URL}/reset?token=${payload.token}&userId=${payload.userId}`,
        name: user.email.split('@')[0],
      }), // HTML body
    }

    let info = await transporter.sendMail(mailOptions)
    return res.status(200).send({ message: 'Sent the email' })
  } catch (error) {
    console.log('error-SERVER', error.message)
    return res.status(500).send({ message: error.message })
  }
})

// Page
router.get('/reset', async (req, res) => {
  try {
    const { token, userId } = req.query

    if (!uuidValidateV4(userId))
      return res.status(400).send(createError.BadRequest('Invalid userID'))

    if (!uuidValidateV5(token))
      return res.status(400).send(createError.BadRequest('Invalid token'))

    const tokenDB = await resetModels.findOne({ token })

    if (tokenDB && userId === tokenDB.userId) {
      return res.render('reset', { userId, url: DOMAIN_URL })
    } else {
      // Authentication failed
      return res.send({ message: 'Something went wrong' })
    }
  } catch (error) {
    console.log('error-SERVER', error.message)
    return res.status(500).send({ message: error.message })
  }
})

// API
router.post('/update', async (req, res) => {
  try {
    const { userId, newPassword } = req.body

    if (!uuidValidateV4(userId))
      return res.status(400).send(createError.BadRequest('Invalid userID'))

    await userModels.updateOne({ uuid: userId }, { $set: { password: newPassword } })

    await resetModels.deleteOne({ userId })

    return res.status(200).send({ message: 'Password updated successfully' })
  } catch (error) {
    console.log('error-SERVER', error.message)
    return res.status(500).send({ message: error.message })
  }
})

// Protected Route
router.get('/private', verifyToken, (req, res) => {
  return res.send('Private route accessed')
})

module.exports = router
