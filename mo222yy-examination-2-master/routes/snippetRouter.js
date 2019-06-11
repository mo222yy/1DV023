'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetController')
const userController = require('../controllers/userController')

// GET /
router.get('/', controller.index)
router.get('/view/:id', controller.viewSnippet)

// GET, POST /create
router.route('/create')
  .get(userController.loggedInAuth, controller.create)
  .post(userController.loggedInAuth, controller.createPost)

// GET, POST /edit
router.get('/edit/:id', userController.loggedInAuth, controller.edit)
router.post('/edit', userController.modifySnippetAuth, controller.editPost)

// GET, POST  /delete
router.get('/delete/:id', userController.loggedInAuth, controller.delete)
router.post('/delete', userController.modifySnippetAuth, controller.deletePost)

module.exports = router
