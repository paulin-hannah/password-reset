require('dotenv').config()

module.exports = {
  DB_URL: process.env.DB_URL,
  PORT_ADDRESS: process.env.PORT_ADDRESS,
  SECRET: process.env.SECRET,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  DOMAIN_URL: process.env.DOMAIN_URL,
}
