'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// create schema
const Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  snippets: {
    type: Object,
    required: true
  }
})

// Hash password prior to save, if modified.
Schema.pre('validate', async function (next) {
  const user = this
  if (user.isModified('hash') || user.isNew) {
    user.hash = await bcrypt.hash(user.hash, 10)
  }
  next()
})

// compare candidate password with stored hash
Schema.methods.compare = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.hash)
}

module.exports = mongoose.model('User', Schema, 'User')
