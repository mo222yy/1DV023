/**
 * Links module.
 * @module ./lib/links.js
 * @author Martin Olsson (mo222yy)
 * @version 1.0.0
 */

'use strict'

const { JSDOM } = require('jsdom')

/**
 * Crawls the web page, extracts and returns the unique absolute links
 *
 * @param {string[]} html
 * @returns {Set()}
 */

const extractLinks = async html => {
  const urlSet = new Set()

  html.map(text => {
    const dom = new JSDOM(text)
    Array.from(dom.window.document.querySelectorAll('a'))
      .map(element => urlSet.add(element.href))
  })
  return urlSet
}

module.exports.extractLinks = extractLinks
