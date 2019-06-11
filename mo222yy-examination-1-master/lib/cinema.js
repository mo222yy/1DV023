/**
 * Cinema module.
 * @module ./lib/cinema.js
 * @author Martin Olsson (mo222yy)
 * @version 1.0.0
 */

'use strict'
const { JSDOM } = require('jsdom')
const fetch = require('node-fetch')

/**
 * Crawls the html to get and return all movies
 *
 * @param {*} html of the cinema page
 */
const findMovies = async (html) => {
  const dom = await new JSDOM(html)
  const movieList = dom.window.document.querySelector('#movie')
  const movieArray = Array.from(movieList.querySelectorAll(`option[value]`))

  const movies = []
  movieArray.forEach(movie => {
    if (movie.value) {
      let m = {}
      m.value = movie.getAttribute('value')
      m.name = movie.textContent
      movies.push(m)
    }
  })
  return movies
}

/**
 * Checks the availability of all movies and returns movies with available seats
 * @param {*} url
 * @param {*} day
 * @param {*} movie
 */
async function checkAvailability (url, days, movies) {
  let movieArray = []

  for (const day of days) {
    for (const movie of movies) {
      const response = await fetch(`${url}/check?day=${day.value}&movie=${movie.value}`)
      const data = await response.json()

      data.forEach(d => {
        if (d.status === 1) {
          d.name = movie.name
          if (day === '05') {
            d.day = 'friday'
          } else if (day === '06') {
            d.day = 'saturday'
          } else if (day === '07') {
            d.day = 'sunday'
          }
          movieArray.push(d)
        }
      })
    }
  }
  return movieArray
}

module.exports.findMovies = findMovies
module.exports.checkAvailability = checkAvailability
