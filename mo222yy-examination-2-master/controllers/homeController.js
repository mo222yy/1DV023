
'use strict'

const moment = require('moment')

const homeController = {}

/**
 * index GET
 */
homeController.index = (req, res, next) => res.render('home/index')
homeController.home = (req, res, next) => res.render('home/index')

/**
 * index POST
*/
homeController.indexPost = (req, res, next) => {
  console.log('hej')
  let locals = {
    name: req.body.name,
    dayName: moment().format('dddd')
  }

  res.render('home/index', { locals })
}

module.exports = homeController
