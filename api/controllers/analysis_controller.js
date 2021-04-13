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

        db.getUserByAccountId([accountId])
        .then(result => {
            if(result.rowCount === 0)
                return res.json(matchAnalysis).status(200).end()

            db.getMatchByIds([matchData["gameId"], accountId])
            .then(result => {
                if(result.rowCount === 0){
                    db.insertMatch([matchData["gameId"], accountId, playerData["championId"], matchAnalysis["match"]["gameCreation"], playerData["lpGain"]])
                    .then(() => {
                        db.addPlayerLP([accountId, playerData["lpGain"]])
                    })
                }

                return res.json(matchAnalysis).status(200).end();
            })
        })
    })
    .catch(err => {
        console.error(err)
        return res.json({"error": "An error occurred during match analysis"}).status(500).end()
    })
}
