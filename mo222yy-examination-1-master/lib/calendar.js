/**
 * Calendar module.
 * @module ./lib/calendar.js
 * @author Martin Olsson (mo222yy)
 * @version 1.0.0
 */

'use strict'

const { JSDOM } = require('jsdom')

/**
 * Creates a "schedule" from the persons calendar page
 *
 * @param {*} html, the html parsed from the calendar page
 * @returns { Object } result
 */
const getSchedule = async html => {
  const dom = await new JSDOM(html)
  const keys = dom.window.document.querySelectorAll('th')
  const available = dom.window.document.querySelectorAll('td')
  const values = []
  available.forEach(a => values.push(a.textContent.toUpperCase()))

  let result = {}
  keys.forEach((key, i) => {
    result[key.textContent] = values[i]
  })
  return result
}

/**
 * Uses the schedule to find a suitable day
 *
 * @param {Object} schedule
 * @returns {Array} suitableDay
 */

const findSuitableDay = async schedule => {
  const result = []
  const suitableDay = []
  let count = {
    friday: 0,
    saturday: 0,
    sunday: 0
  }

  schedule.forEach(s => {
    if (s.Friday === 'OK') { count.friday++ }
    if (s.Saturday === 'OK') { count.saturday++ }
    if (s.Sunday === 'OK') { count.sunday++ }
  })

  for (let [key, value] of Object.entries(count)) {
    if (value === schedule.length) {
      suitableDay.push(key)
    }
  }
  suitableDay.forEach(d => {
    let object = {}
    object.day = d

    if (d === 'friday') {
      object.value = '05'
    } else if (d === 'saturday') {
      object.value = '06'
    } else if (d === 'sunday') {
      object.value = '07'
    }
    result.push(object)
  })

  return result
}

module.exports.getSchedule = getSchedule
module.exports.findSuitableDay = findSuitableDay
