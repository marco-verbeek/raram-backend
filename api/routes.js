const Router = require("express-promise-router")
const router = new Router()

const analysis_controller = require("./controllers/analysis_controller")
const overview_controller = require("./controllers/overview_controller")
const profile_controller = require("./controllers/profile_controller")

// This endpoint provides the complete analysis to a match.
router.get("/analysis", analysis_controller.match_analysis)

// This endpoint provides an overview of a certain amount of recent matches.
router.get("/overview", overview_controller.overview)

// This endpoint provides the information linked to the player's profile.
router.get("/profile", profile_controller.profile_summary)
router.get("/profile/verify", profile_controller.profile_verify)
router.get("/profile/verificon", profile_controller.icon_verify)

module.exports = router;