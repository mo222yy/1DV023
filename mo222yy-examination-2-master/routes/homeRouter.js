
'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/homeController')

router.get('/', controller.index)
router.get('/index', controller.home)

router.post('/', controller.indexPost)

module.exports = router
