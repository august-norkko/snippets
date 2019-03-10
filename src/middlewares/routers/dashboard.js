'use strict'

const router = require('express').Router()
const controller = require('../../controllers/dashboard')

const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

router.route('/')
  .get(controller.dashboard)

router.route('/create')
  .get(csrfProtection, controller.getCreateSnippet)
  .post(csrfProtection, controller.postCreateSnippet)

router.route('/edit/:id')
  .get(csrfProtection, controller.getEditSnippet)
  .post(csrfProtection, controller.postEditSnippet)

router.route('/delete/:id')
  .get(controller.deleteSnippet)

module.exports = router
