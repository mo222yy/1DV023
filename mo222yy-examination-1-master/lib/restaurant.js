/**
 * Resaurant module.
 * @module ./lib/restaurant.js
 * @author Martin Olsson (mo222yy)
 * @version 1.0.0
 */

'use strict'
const { JSDOM } = require('jsdom')

const findFreeTables = async (html, days) => {
  const dom = await new JSDOM(html)
  const bookings = dom.window.document.querySelectorAll('.MsoNormal')
  const tables = []

  bookings.forEach(b => {
    let free = b.textContent.substr(b.textContent.length - 4)
    if (free === 'Free') {
      tables.push(b.childNodes[0].value)
    }
  })

  let allAvailableTables = []

  tables.forEach(t => {
    let day = t.substr(0, 3)
    let startTime = t.substr(t.length - 4, 2) + ':00'
    let endTime = t.substr(t.length - 2) + ':00'
    let table = {}
    if (day === 'fri') {
      table.day = 'friday'
      table.value = '05'
    } else if (day === 'sat') {
      table.day = 'saturday'
      table.value = '06'
    } else if (day === 'sun') {
      table.day = 'sunday'
      table.value = '07'
    }
    table.startTime = startTime
    table.endTime = endTime
    allAvailableTables.push(table)
  })

  const tablesForSuitableDays = []
  days.forEach(d => {
    allAvailableTables.forEach(t => {
      if (d.day === t.day) {
        tablesForSuitableDays.push(t)
      }
    })
  })
  return tablesForSuitableDays
}

module.exports.findFreeTables = findFreeTables
