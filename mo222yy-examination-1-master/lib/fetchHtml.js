/**
 * getHTML module
 * @module ./lib/fetchHtml.js
 * @author Martin Olsson @mo222yy
 * @version 1.0.0
 */

'use strict'

const fetch = require('node-fetch')
let request = require('request-promise').defaults({ jar: true, simple: false })

/**
 * fetches HTML from the url param
 *
 * @param {String[]} url
 * @returns  {object[]} HTML of url
 */

const extractHtml = async url => {
  const urlText = await getText(url)
  const text = await Promise.all([urlText])

  return text
}

const getText = async url => {
  const response = await fetch(url)
  return response.text()
}

/**
 * Uses request-promise to get html from restaurant bookingpage
 * @param {} url
 * @return {Promise} html of restaurant bookingpage
 */

function login (url) {
  const loginUrl = url + '/login/'
  const username = 'zeke'
  const password = 'coys'

  return new Promise(function (resolve, reject) {
    request.post({
      url: loginUrl,
      form: {
        username: username,
        password: password
      }
    }, function (error, response, body) {
      if (error) { console.log(error.statusCode) }
      request.get({
        url: url + '/' + response.headers.location
      }, function (error, response, body) {
        if (error) {
          console.log('ERROR')
        } else {
          resolve(body)
        }
      })
    })
  })
}

module.exports.extractHtml = extractHtml
module.exports.login = login
