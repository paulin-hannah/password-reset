const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const { PORT_ADDRESS, DB_URL } = require('./config')

// APP SETUP
const port = process.env.PORT || PORT_ADDRESS
const app = express()

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB is connected'))
  .catch((error) => console.log(error))

app.use(cors())
app.use(express.json())

app.use('/', require('./router'))
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(port, () =>
  console.log(`server is running @ http://localhost:${port}`)
)
