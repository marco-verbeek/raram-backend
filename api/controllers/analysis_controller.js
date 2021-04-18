'use strict'
require('dotenv').config()

const db = require("../../src/database");

const {performMatchAnalysis, playerInfoFromAnalysis, getWinFromAnalysis, getRaramSearchedGames} = require("../../utils/analysis_helper")
const {leagueJs} = require('../../src/league')

exports.match_analysis = async function (req, res){
    const dev = req.query.dev !== undefined ?? false

    const summonerData = await leagueJs.Summoner.gettingByName(req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty")
    const accountId = summonerData["accountId"]
    let limit

    const options = {"queue": [450]}
    if(dev){
        limit = 1
        options["endIndex"] = limit
    } else {
        const requirements = await db.getUserRaramRequirements([accountId])

        limit = requirements.rows[0]["raram_amount"]
        options["beginTime"] = new Date(requirements.rows[0]["raram_date"]).getTime()
    }

    const matchList = await leagueJs.Match.gettingListByAccount(accountId, "euw1", options)
    const matches = getRaramSearchedGames(matchList["matches"], limit)

    // TODO: this should not [0]... What if there are multiple matches?
    const matchData = await leagueJs.Match.gettingById(matchList["matches"][0]["gameId"])

    const matchAnalysis = performMatchAnalysis(matchData)
    const playerData = playerInfoFromAnalysis(matchAnalysis, accountId)

    const userData = await db.getUserByAccountId([accountId])

    // User has no raram account, just display info TODO: remove LP or return you need an account
    if(userData.rowCount === 0)
        return res.json(matchAnalysis).status(200).end()

    const dbMatch = await db.getMatchByIds([matchData["gameId"], accountId])

    // If the game has not been added to the database previously
    if(dbMatch.rowCount === 0){
        console.log("match was not in db. adding now.")

        await db.insertMatch([matchData["gameId"], accountId, playerData["championId"], matchAnalysis["match"]["gameCreation"], playerData["lpGain"]])
        await db.updatePlayerLP([accountId])


        await db.updatePlayerStats([
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

        await db.updateHighestWinstreak([accountId])
    }

    return res.json(matchAnalysis).status(200).end();
}
