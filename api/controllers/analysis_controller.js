'use strict'
require('dotenv').config()

const db = require("../../src/database");

const {performMatchAnalysis, playerInfoFromAnalysis} = require("../../utils/analysis_helper")
const {leagueJs} = require('../../src/leagueJS_setup')

exports.match_analysis = async function (req, res){
    let accountId = ""

    leagueJs.Summoner
    .gettingByName(req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty")
    .then(summonerData => {
        accountId = summonerData["accountId"]
        return leagueJs.Match.gettingListByAccount(accountId, "euw1", {queue: [450], endIndex: 1})
    })
    .then(matchesData => {
        return leagueJs.Match.gettingById(matchesData["matches"][0]["gameId"])
    })
    .then(matchData => {
        const matchAnalysis = performMatchAnalysis(matchData)
        const playerData = playerInfoFromAnalysis(matchAnalysis, accountId)

        // TODO: put code somewhere more appropriate
        db.query('SELECT * FROM raram.matches WHERE match_id = $1 AND account_id = $2', [matchData["gameId"], accountId])
        .then(result => {
            if(result.rowCount === 0){
                console.log("Match was not found in DB")

                db.query('INSERT INTO raram.matches(match_id, account_id, champion_id, date, lp_gain) VALUES($1, $2, $3, to_timestamp($4 / 1000.0), $5)', [
                    matchData["gameId"],
                    accountId,
                    playerData["championId"],
                    matchAnalysis["match"]["gameCreation"],
                    playerData["lpGain"]
                ])
                .then(() => {
                    console.log("Added match to DB.")

                    db.query('UPDATE raram.users SET lp = lp + $2 WHERE account_id = $1', [accountId, playerData["lpGain"]])
                    .then(() => {
                       console.log("Added LP to player in DB.")
                    })
                })
            } else {
                console.log("Match was already in DB.")
            }

            return res.json(matchAnalysis).status(200).end();
        })
    })
    .catch(err => {
        console.log(err)
        return res.json({"error": "An error occurred during match analysis"}).status(500).end()
    })
}