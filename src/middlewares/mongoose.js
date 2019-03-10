'use strict'

const mongoose = require('mongoose')

// Use env file
require('dotenv')
  .load({ path: 'src/.env' })

module.exports.connect = async () => {
  mongoose.Promise = global.Promise

  // Configure mongoose
  mongoose.set('useCreateIndex', true)
  mongoose.set('useNewUrlParser', true)
  mongoose.set('useFindAndModify', false)

  // Error handling
  mongoose.connection.on('connected', () => { console.log('Connected to MongoDB.') })
  mongoose.connection.on('error', err => { console.error('Database connection error: %s', err) })
  mongoose.connection.on('disconnected', () => { console.error('Database connection disconnected.') })

  // Connect to URI
  return mongoose.connect(process.env.MONGO_URI)
}
