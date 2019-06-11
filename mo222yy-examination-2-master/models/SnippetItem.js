'use strict'

const mongoose = require('mongoose')

// Create a schema.
const snippetItemSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  body: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  }
})

// Create a model using the schema.
const SnippetItem = mongoose.model('snippetItem', snippetItemSchema)

// Exports.
module.exports = SnippetItem
