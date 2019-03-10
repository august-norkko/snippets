'use strict'

const express = require('express')
const app = express()

const expressValidator = require('express-validator')
app.use(expressValidator())

const bodyParser = require('body-parser')
const flash = require('express-flash')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const helmet = require('helmet')
const PORT = 8000

// Routers
const user = require('./middlewares/routers/user')
const dashboard = require('./middlewares/routers/dashboard')
const error = require('./middlewares/error')

// Use environment file
require('dotenv')
  .load({ path: 'src/.env' })

// Connect to database
require('./middlewares/mongoose')
  .connect()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

// Express configuration
app.set('host', '0.0.0.0')
app.set('port', PORT)
app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'ejs')

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'localhost'],
    scriptSrc: ["'self'", "'unsafe-inline'", 'netdna.bootstrapcdn.com', 'stackpath.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'use.fontawesome.com'],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com', 'netdna.bootstrapcdn.com', 'stackpath.bootstrapcdn.com', 'https://fonts.googleapis.com', 'use.fontawesome.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'use.fontawesome.com'],
    sandbox: ['allow-forms', 'allow-scripts'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false
  },
  loose: false,
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: false,
  browserSniff: true
}))
app.use(helmet())

// Session configuration
app.use(cookieParser())
app.use(session({
  key: 'user_id',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 120000000
  }
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(flash())

// Use routers
app.use('/', user)
app.use('/dashboard', error.isAuthorized, dashboard)

// Error handler
const { $404, handler } = require('./middlewares/error')
app.use($404, handler)

// Start app
app.listen(PORT)

module.exports = app
