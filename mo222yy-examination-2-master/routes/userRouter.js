'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController')

// GET /
router.get('/', controller.login)

router.route('/login')
  .get(controller.login)
  .post(controller.loginPost)

// GET, POST /create
router.route('/create')
  .get(controller.create)
  .post(controller.createPost)

router.route('/logout')
  .get(controller.logout)
// Exports.
module.exports = router
