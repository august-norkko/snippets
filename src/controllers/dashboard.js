'use strict'

const User = require('../models/schema')

// GET /dashboard
exports.dashboard = async (req, res, next) => {
  try {
    await User.findOne({ username: req.session.user.username })
      .then(async user => {
        return res.render('dashboard/dashboard.ejs', { title: 'Dashboard', obj: user, session: req.session.user })
      })
  } catch (err) {
    next(err)
  }
}

// GET /dashboard/create
exports.getCreateSnippet = (req, res, next) => {
  try {
    return res.render('dashboard/create.ejs', { title: 'Create new Snippet', session: req.session.user, csrfToken: req.csrfToken() })
  } catch (err) {
    next(err)
  }
}

// POST /dashboard/edit/:id
exports.postCreateSnippet = async (req, res, next) => {
  try {
    const _id = '_' + Math.random().toString(36).substr(2, 9)
    const snippet = [req.body.code, req.body.tags.split(','), _id]
    await User.findOneAndUpdate({ username: req.session.user.username }, { $push: { snippets: snippet } })
      .then(() => {
        req.flash('info', 'Successfully created snippet')
        return res.redirect('/dashboard')
      })
  } catch (err) {
    next(err)
  }
}

// GET /dashboard/edit/:id
exports.getEditSnippet = async (req, res, next) => {
  try {
    await User.findOne({ username: req.session.user.username })
      .then(async user => {
        return res.render('dashboard/edit.ejs', {
          title: 'Edit Snippet',
          code: user.snippets[req.params.id][0],
          tags: user.snippets[req.params.id][1],
          session: req.session.user,
          csrfToken: req.csrfToken()
        })
      })
  } catch (err) {
    next(err)
  }
}

// POST /dashboard/edit/:id
exports.postEditSnippet = async (req, res, next) => {
  try {
    const _id = '_' + Math.random().toString(36).substr(2, 9)
    const snippet = [req.body.code, req.body.tags.split(','), _id]
    await User.findOne({ username: req.session.user.username })
      .then(async user => {
        user.snippets[req.params.id] = snippet
        user.markModified('snippets')
        await user.save()
        req.flash('info', 'Successfully edited snippet')
        return res.redirect('/dashboard')
      })
  } catch (err) {
    next(err)
  }
}

// GET /dashboard/delete/:id
exports.deleteSnippet = async (req, res, next) => {
  try {
    await User.findOne({ username: req.session.user.username })
      .then(async user => {
        await User.findOneAndUpdate({ username: req.session.user.username }, { $pull: { 'snippets': user.snippets[req.params.id] } })
        req.flash('info', 'Successfully deleted snippet')
        return res.redirect('/dashboard')
      })
  } catch (err) {
    next(err)
  }
}
