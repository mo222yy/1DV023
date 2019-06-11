'use strict'

const mongoose = require('mongoose')
const CONNECTION_STRING = process.env.CONNECTION_STRING
const db = mongoose.connection

module.exports.connect = async () => {
  db.on('connected', () => console.log('Mongoose connection is open.'))
  db.on('error', err => console.error(`Mongoose connection error has occured ${err}`))
  db.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  return mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
}
