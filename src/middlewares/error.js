'use strict'

const path = require('path')

// Handle errors with static files
exports.handler = (err, req, res, next) => {
  if (err.status === 403) {
    return res.status(403).sendFile(path.join(__dirname, '..', 'views', 'pages', 'error', '403.html'))
  }

  if (err.status === 404) {
    return res.status(404).sendFile(path.join(__dirname, '..', 'views', 'pages', 'error', '404.html'))
  }

  return res.status(err.status || 500).sendFile(path.join(__dirname, '..', 'views', 'pages', 'error', '500.html'))
}

// Send 404 error to error handler
exports.$404 = (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
}

// Send 403 error to error handler
exports.isAuthorized = (req, res, next) => {
  if (req.cookies.user_id && req.session.user) {
    next()
  } else {
    const error = new Error('Forbidden')
    error.status = 403
    return next(error)
  }
}
