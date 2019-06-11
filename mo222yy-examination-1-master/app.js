/**
 * The starting point of the application
 * @author Martin Olsson(mo222yy)
 * @version 1.0.0
 */

'use strict'
const links = require('./lib/links.js')
const fetchHtml = require('./lib/fetchHtml')
const calendar = require('./lib/calendar.js')
const cinema = require('./lib/cinema.js')
const restaurant = require('./lib/restaurant.js')
const recommendation = require('./lib/recommendation.js')

let args = process.argv.slice(1)

if (args.length === 0) {
  console.log('ERROR: No argument')
  process.exit(0)
} else {
  start(args[1])
}

async function start (url) {
  console.log('Web agent start running \n')

  // Fetch startpage and extract links
  const fetchStartPage = await fetchHtml.extractHtml(url)
  const extractLinksSet = await links.extractLinks(fetchStartPage)
  const urlLinks = [] // UrlLinks 0 = calendar, 1 = cinema, 2 = dinner
  extractLinksSet.forEach(link => {
    urlLinks.push(link)
  })

  console.log('Fetching links...OK')

  // Fetch calendar page and get person links
  const fetchCalendar = await fetchHtml.extractHtml(urlLinks[0])
  const personExtensions = await links.extractLinks(fetchCalendar)

  // Fetch html from all calendars
  const calendarPromise = []
  personExtensions.forEach(person => {
    let plink = fetchHtml.extractHtml(`${urlLinks[0]}` + '/' + person)
    calendarPromise.push(plink)
  })
  const calendarHtml = await Promise.all(calendarPromise)
  // Send each calendar(html) to calendar module to return a schedule
  const personSchedules = []
  await calendarHtml.forEach(c => {
    let schedule = calendar.getSchedule(c)
    personSchedules.push(schedule)
  })
  const schedules = await Promise.all(personSchedules)

  // send in the schedule to find a suitable day
  const suitableDays = await calendar.findSuitableDay(schedules)
  if (suitableDays.length <= 0) {
    console.log('Could not find a suitable day for everyone')
  }

  console.log('Finding free days...OK')

  // Fetch the cinema page and get movies with available seats for the suitable day(s).
  const cinemaPage = await fetchHtml.extractHtml(urlLinks[1])
  const movies = await cinema.findMovies(cinemaPage)
  const suitableMovies = await cinema.checkAvailability(urlLinks[1], suitableDays, movies)

  console.log('Fetching movie shows...OK')

  // get restaurant page
  const restaurantPage = await fetchHtml.login(urlLinks[2])
  const availableTables = await restaurant.findFreeTables(restaurantPage, suitableDays)

  console.log('Fetching restaurant bookings...OK')
  console.log('Putting together recommendations...OK\n')

  // put it all together and show suggestions
  const result = await recommendation.presentation(suitableMovies, availableTables)
  result.forEach(r => {
    console.log(r)
  })
}
