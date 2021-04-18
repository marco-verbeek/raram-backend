'use strict'
require('dotenv').config()

const db = require("../../src/database");

const {performMatchAnalysis, playerInfoFromAnalysis, getWinFromAnalysis} = require("../../utils/analysis_helper")
const {leagueJs} = require('../../src/league')

exports.match_analysis = function (req, res){
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
                        db.updatePlayerLP([accountId, playerData["lpGain"]])
                        .then(() => {
                            db.updatePlayerStats([
                                accountId,
                                playerData["kills"],
                                playerData["deaths"],
                                playerData["assists"],
                                getWinFromAnalysis(matchAnalysis, accountId) ? 1 : 0,
                                playerData["damageDone"],
                                playerData["damageTaken"],
                                playerData["healed"],
                                playerData["doubleKills"],
                                playerData["tripleKills"],
                                playerData["quadraKills"],
                                playerData["pentaKills"],
                                playerData["goldEarned"],
                                playerData["goldSpent"],
                                playerData["totalMinionsKilled"],
                                playerData["firstBloodKill"] ? 1 : 0,
                                playerData["longestTimeSpentLiving"]
                            ])
                            .then(() => {
                                db.updateHighestWinstreak(accountId)
                            })
                        })
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
