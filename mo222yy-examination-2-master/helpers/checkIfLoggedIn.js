'use strict'

function checkIfLoggedIn (req, res, next) {
  if (req.session.name) {
    const loggedIn = {
      authenticated: true,
      username: req.session.name
    }
    res.locals.authenticated = loggedIn
  }
  next()
}
module.exports = checkIfLoggedIn
