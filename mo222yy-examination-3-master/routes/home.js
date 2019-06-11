'use strict'
const express = require('express')
const router = express.Router()
const dateFormat = require('dateformat')

const gh = require('octonode')
const client = gh.client(process.env.PERSONAL_ACCESS_TOKEN)
const ghrepo = client.repo('1dv023/mo222yy-examination-3')

router.route('/')
  .get((req, res) => {
    const repo = ghrepo.name
    ghrepo.issues(function (callback, body, header) {
      const issues = body.map(issue => {
        return {
          id: issue.id,
          title: issue.title,
          body: issue.body,
          link: issue.html_url,
          comments: issue.comments,
          created: dateFormat(issue.created_at),
          updated: dateFormat(issue.updated_at),
          user: issue.user.login
        }
      })
      res.render('home/index', { issues: issues, repo: repo })
    })
  })

module.exports = router
