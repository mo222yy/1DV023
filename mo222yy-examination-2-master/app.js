'use strict'
require('dotenv').config() // Read .env file

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const helmet = require('helmet')
const checkIfLoggedIn = require('./helpers/checkIfLoggedIn')

const mongoose = require('./config/mongoose')

const app = express()

// Connect to MongoDB
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

app.use(bodyParser.urlencoded({ extended: false }))

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// setup and use session middleware (https://github.com/expressjs/session)
const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE,
  saveUnitialized: process.env.SESSION_SAVEUNINITIALIZED,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax',
    httpOnly: true,
    secure: false
  }
}
app.use(session(sessionOptions))
app.use(checkIfLoggedIn)

// middleware to be executed before the routes
app.use((req, res, next) => {
  // flash messages - survives only a round trip
  res.locals.flash = req.session.flash
  delete req.session.flash

  next()
})

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com', 'use.fontawesome.com'],
    scriptSrc: ["'self'", 'use.fontawesome.com', 'stackpath.bootstrapcdn.com'],
    imgSrc: ["'self'", 'unsplash.it', 'picsum.photos'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false
  }
}))

// routes
app.use('/', require('./routes/homeRouter'))
app.use('/snippet', require('./routes/snippetRouter'))
app.use('/user', require('./routes/userRouter'))

// additional middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal Server Error')
})

// listen to provided port
const port = process.env.NODEPORT || 3000
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
