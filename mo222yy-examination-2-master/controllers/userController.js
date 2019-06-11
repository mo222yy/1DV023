'use strict'

const User = require('../models/User')
const SnippetItem = require('../models/SnippetItem')

const userController = {}
/**
 * index GET
 */
userController.login = async (req, res, next) => {
  try {
    res.render('user/login')
  } catch (error) {
    console.log(error)
  }
}

/**
 * LoginPost
 */
userController.loginPost = async (req, res, next) => {
  let user = await User.findOne({ 'username': req.body.username })
  if (!user) {
    req.session.flash = { type: 'danger', text: 'Username doesn´t exist' }
    res.redirect('.')
  }
  let result = await user.comparePassword(req.body.password)
  if (result) {
    req.session.name = user.username
    req.session.regenerate(function (err) {
      if (err) { console.log(err) }
    })
    req.session.flash = { type: 'success', text: `Welcome to Codesnippets ${user.username}` }
    res.redirect('/snippet')
  } else {
    req.session.flash = { type: 'danger', text: 'Incorrect username or password' }
    res.redirect('.')
  }
}

/**
 * Logout
 */
userController.logout = async (req, res, next) => {
  try {
    req.session.flash = { type: 'success', text: 'logout successful' }
    res.redirect('/')
    req.session.destroy()
  } catch (error) {
    console.log(error)
  }
}

/**
 * Create user GET
 */
userController.create = async (req, res, next) => {
  const locals = {
    username: '',
    password: ''
  }

  res.render('user/create', { locals })
}

/**
 * Create user POST
 */
userController.createPost = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })

    await user.save()

    req.session.flash = {
      type: 'success',
      text: 'Account was created successfully'
    }
    res.redirect('.')
  } catch (error) {
    console.log('ERRORCODE: ', error.code)
    req.session.flash = {
      type: 'danger',
      text: error.code === 11000 ? 'Create user failed, Username already exists' : 'Create user failed, Password must be atleast 8 characters'
    }
    res.redirect('/user/create')
  }
}

/**
 * Authorization
 */
userController.loggedInAuth = async function (req, res, next) {
  let user = await User.findOne({ 'username': req.session.name })
  if (!user) {
    req.session.flash = { type: 'danger', text: '403 Forbidden, You have to log in to create snippets' }
    res.redirect('/snippet')
  } else {
    next()
  }
}

userController.modifySnippetAuth = async function (req, res, next) {
  const snippetItem = await SnippetItem.findOne({ _id: req.body.id })
  if (snippetItem.username === req.session.name) {
    next()
  } else {
    if (req.path === '/edit') {
      req.session.flash = { type: 'danger', text: `401, Unauthorized, you don't have persmission to edit this snippet` }
      res.redirect('.')
    } else if (req.path === '/delete') {
      req.session.flash = { type: 'danger', text: `401, Unauthorized, you don't have persmission to delete this snippet` }
      res.redirect('.')
    }
  }
}

// Exports.
module.exports = userController
