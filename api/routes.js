const Router = require('express-promise-router')
const router = new Router()

const analysis_controller = require('./controllers/analysis_controller')
const overview_controller = require('./controllers/overview_controller')
const profile_controller = require('./controllers/profile_controller')
const timer_controller = require('./controllers/timer_controller')

// This endpoint provides the complete analysis to a match.
router.get('/analysis/:name', analysis_controller.match_analysis)
router.get('/analysis/only/:gameId', analysis_controller.only_analysis)

// This endpoint provides an overview of a certain amount of recent matches.
router.get('/overview/:name', overview_controller.overview)

// This endpoint provides the information linked to the player's profile.
router.get('/profile/:name', profile_controller.profile_summary)
router.get('/profile/verify/:name', profile_controller.profile_verify)
router.get('/profile/verificon/:name', profile_controller.icon_verify)

// This endpoint provides a way to determine which games the user wants to consider ranked.
router.get('/timer/:name', timer_controller.overview_timer)
router.post('/timer/:name', timer_controller.set_timer)

module.exports = router