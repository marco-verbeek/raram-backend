const db = require("../../src/database");
const {getRecentMatches} = require("../../utils/overview_helper");
const {leagueJs} = require("../../src/league");

exports.overview = function (req, res){
    const summonerName = req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty"

    leagueJs.Summoner
    .gettingByName(summonerName)
    .then(summonerData => {
        return db.getRecentMatches([summonerData["accountId"]])
    })
    .then(result => {
        if(result.rowCount === 0)
            return res.json({}).status(200).end()

        const recentMatches = getRecentMatches(result.rowCount, result.rows)
        return res.json(recentMatches).status(200).end()
    })
    .catch(err => {
        console.log(err)
        return res.json({"error": "Could not get profile overview"}).status(500).end()
    })
}
