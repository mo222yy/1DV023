/**
 * Put together module.
 * @module ./lib/putTogether.js
 * @author Martin Olsson (mo222yy)
 * @version 1.0.0
 */

'use strict'

/**
 * puts together scraped information to find a suitable day, movie and dinner
 *
 */

const presentation = (movies, tables) => {
  const suggestions = []
  movies.forEach(m => {
    tables.forEach(t => {
      let mTime = parseInt(m.time)
      let tTime = parseInt(t.startTime)
      if (mTime + 2 === tTime && m.day === t.value) {
        let object = {
          day: t.day,
          movie: m.name,
          movieStartTime: m.time,
          tableStartTime: t.startTime,
          tableEndTime: t.endTime
        }
        suggestions.push(object)
      }
    })
  })

  let result = []
  suggestions.forEach(s => {
    let string = `* On ${s.day.charAt(0).toUpperCase() + s.day.slice(1)} there is a free table between ${s.tableStartTime} and ${s.tableEndTime},
    after you have seen "${s.movie}" which starts at ${s.movieStartTime} \n`
    result.push(string)
  })
  return result
}

module.exports.presentation = presentation
