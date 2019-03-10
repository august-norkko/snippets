'use strict'

const User = require('../models/schema')

// GET /
exports.getindex = async (req, res, next) => {
  try {
    await User.find({})
      .then(async users => {
        return res.render('index.ejs', { title: 'Home', obj: users, session: req.session.user })
      })
  } catch (err) {
    next(err)
  }
}

// GET /register
exports.getregister = (req, res, next) => {
  try {
    return res.render('register.ejs', { title: 'Register', forms: null, session: req.session.user, csrfToken: req.csrfToken() })
  } catch (err) {
    next(err)
  }
}

// POST /register
exports.postregister = async (req, res, next) => {
  const form = [ req.body.username, req.body.email, req.body.password, req.body.passwordconfirm ]
  const acc = new User({
    username: req.body.username,
    email: req.body.email,
    hash: req.body.password,
    createdAt: Date.now(),
    snippets: []
  })

  req.checkBody('username')
    .notEmpty().withMessage('Username missing')
    .isAlphanumeric().withMessage('Invalid username')
    .isLength({ min: 6, max: 25 }).withMessage('Username length invalid (6-24 char)')

  req.checkBody('email')
    .notEmpty().withMessage('Email missing')
    .isEmail().withMessage('Email invalid')

  req.checkBody('password')
    .notEmpty().withMessage('Password missing')
    .isLength({ min: 8, max: 65 }).withMessage('Password length invalid (8-64 char)')
    .equals(req.body.passwordconfirm).withMessage('Passwords do not match')

  req.checkBody('passwordconfirm')
    .notEmpty().withMessage('Confirm password missing')

  const errs = req.validationErrors()
  if (errs) {
    errs.forEach(err => { req.flash('error', err.msg) })
    return res.render('register.ejs', { title: 'Register', forms: form, session: req.session.user })
  }

  try {
    // check for free username
    const username = await User.findOne({ username: req.body.username })
    if (username) {
      req.flash('error', 'Username already exists')
      return res.render('register.ejs', { title: 'Register', forms: form, session: req.session.user })
    } else {
      // check for free email
      const email = await User.findOne({ email: req.body.email })
      if (email) {
        req.flash('error', 'Email already exists')
        return res.render('register.ejs', { title: 'Register', forms: form, session: req.session.user })
      } else {
        // store user in database
        await acc.save()
          .then(user => {
            req.session.user = user
            req.flash('info', 'Successfully created account')
            return res.redirect('/dashboard')
          })
      }
    }
  } catch (err) {
    next(err)
  }
}

// GET /login
exports.getlogin = (req, res, next) => {
  try {
    return res.render('login.ejs', { title: 'Login', session: req.session.user, csrfToken: req.csrfToken() })
  } catch (err) {
    next(err)
  }
}

// POST /login
exports.postlogin = async (req, res, next) => {
  req.checkBody('username')
    .notEmpty().withMessage('Username missing')

  req.checkBody('password')
    .notEmpty().withMessage('Password missing')
    .isLength({ min: 8, max: 65 }).withMessage('Password length invalid (8-64 char)')

  const errs = req.validationErrors()
  if (errs) {
    errs.forEach(err => { req.flash('error', err.msg) })
    return res.redirect('/login')
  }

  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      req.flash('error', 'Password or username incorrect')
      return res.redirect('/login')
    }
    user.compare(req.body.password)
      .then(result => {
        if (result) {
          req.session.user = user
          req.flash('info', 'Successfully logged in')
          return res.redirect('/dashboard')
        } else {
          req.flash('error', 'Password or username incorrect')
          return res.redirect('/login')
        }
      })
  } catch (err) {
    next(err)
  }
}

// GET /logout
exports.getlogout = async (req, res, next) => {
  try {
    req.session.user = null
    req.flash('info', 'Successfully logged out')
    return res.redirect('/')
  } catch (err) {
    next(err)
  }
}
