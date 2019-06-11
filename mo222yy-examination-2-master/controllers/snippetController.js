'use strict'

const SnippetItem = require('../models/SnippetItem')

const snippetController = {}

/**
 * index GET
 */
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
      snippetItems: (await SnippetItem.find({}))
        .map(snippetItem => ({
          id: snippetItem._id,
          username: snippetItem.username,
          description: snippetItem.description,
          body: snippetItem.body
        }))
    }
    res.render('snippet/index', { locals })
  } catch (error) {
    next(error)
  }
}

snippetController.viewSnippet = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      description: snippetItem.description,
      body: snippetItem.body
    }
    res.render('snippet/view', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 * create GET
 */
snippetController.create = async (req, res, next) => {
  const locals = {
    description: '',
    body: ''
  }
  res.render('snippet/create', { locals })
}

/**
   * create POST
   */
snippetController.createPost = async (req, res, next) => {
  try {
    const snippetItem = new SnippetItem({
      username: req.session.name,
      description: req.body.description,
      body: req.body.body
    })

    await snippetItem.save()

    req.session.flash = {
      type: 'success',
      text: 'Snippet was created successfully.'
    }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./create')
  }
}

/**
 * edit GET
 */
snippetController.edit = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      id: snippetItem._id,
      description: snippetItem.description,
      body: snippetItem.body
    }
    res.render('snippet/edit', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
   * edit POST
   */
snippetController.editPost = async (req, res, next) => {
  try {
    const result = await SnippetItem.updateOne({ _id: req.body.id }, {
      username: req.session.name,
      description: req.body.description,
      body: req.body.body
    })

    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Snippet was updated successfully.' }
    } else {
      req.session.flash = {
        type: 'danger',
        text: 'The snippet you attempted to update was removed by another user after you got the original values.'
      }
    }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect(`./edit/${req.body.id}`)
  }
}

/**
 * delete GET
 */
snippetController.delete = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      id: snippetItem._id,
      description: snippetItem.description,
      body: snippetItem.body
    }
    res.render('snippet/delete', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}
/**
 * delete POST
 */
snippetController.deletePost = async (req, res, next) => {
  try {
    await SnippetItem.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'Snippet was removed successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    req.redirect(`./delete/${req.body.id}`)
  }
}

// Exports.
module.exports = snippetController
