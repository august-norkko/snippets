'use strict'

const router = require('express').Router()
const controller = require('../../controllers/user')

const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

router.route('/')
  .get(controller.getindex)

router.route('/login')
  .get(csrfProtection, controller.getlogin)
  .post(csrfProtection, controller.postlogin)

router.route('/register')
  .get(csrfProtection, controller.getregister)
  .post(csrfProtection, controller.postregister)

router.route('/logout')
  .get(controller.getlogout)

module.exports = router
