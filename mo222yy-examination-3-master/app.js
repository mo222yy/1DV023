'use strict'
require('dotenv').config()
const express = require('express')
const path = require('path')
const hbs = require('express-hbs')
const app = express()
const socket = require('socket.io')
const bodyParser = require('body-parser')
const dateFormat = require('dateformat')
const GithubWebHook = require('express-github-webhook')
const github = GithubWebHook({ path: '/payload', secret: process.env.WEBHOOK_TOKEN })
const csp = require('helmet-csp')

// Start server
const PORT = process.env.NODEPORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

const server = app.listen(PORT, () => {
  console.log(`listening to requests on port ${PORT}, Environment is set to ${NODE_ENV}`)
})
const io = socket(server)

// View engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

/* ----------- Helmet ------------- */
app.use(csp({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'",
      "'unsafe-inline'",
      'stackpath.bootstrapcdn.com'
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'use.fontawesome.com',
      'stackpath.bootstrapcdn.com',
      'code.jquery.com/jquery-3.3.1.slim.min.js',
      'cdnjs.cloudflare.com'
    ],
    imgSrc: ["'self'", 'www.baltana.com', 'avatars2.githubusercontent.com'],
    sandbox: ['allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false
  }
}))

/* ----------- Routes ------------- */
app.use('/', require('./routes/home'))

app.post('/report-violation', (req, res) => {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }
  res.status(204).end()
})

// additional middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
  type: ['json', 'application/csp-report']
}))
app.use(github)
app.use(express.static(path.join(__dirname, 'public')))

/* ----------- WebSocket ------------- */
io.on('connection', (socket) => {
  github.on('issues', (repo, data) => {
    const created = dateFormat(data.issue.created_at)
    const updated = dateFormat(data.issue.updated_at)

    socket.emit('message', (data))
    if (data.action === 'opened' || data.action === 'reopened') {
      socket.emit('addIssue', {
        issue: data.issue,
        created: created,
        updated: updated
      })
    } else if (data.action === 'edited') {
      socket.emit('editIssue', {
        issue: data.issue,
        updated: updated
      })
    } else if (data.action === 'closed') {
      socket.emit('removeIssue', (data.issue.id))
    }
  })
  github.on('issue_comment', (repo, data) => {
    socket.emit('message', (data))
    socket.emit('updateComments', (data))
  })

  github.on('error', function (err, req, res) {
    if (err) {
      console.log(err)
    }
  })
})

/* ----------- Error handling ------------- */
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal Server Error')
})
