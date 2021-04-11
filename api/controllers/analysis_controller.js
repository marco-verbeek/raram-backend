'use strict'
require('dotenv').config()

const _ = require('lodash');
const db = require("../../src/database");

const {limit, calculateGain, getChampionNameById, format} = require("../../utils/analysis_helper")
const {leagueJs} = require('../../src/leagueJS_setup')

exports.match_analysis = async function (req, res){
    leagueJs.Summoner
        .gettingByName(req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty")
        .then(summonerData => {
            return leagueJs.Match.gettingListByAccount(summonerData["accountId"], "euw1", {queue: [450], endIndex: 1})
        })
        .then(matchesData => {
            return leagueJs.Match.gettingById(matchesData["matches"][0]["gameId"])
        })
        .then(matchData => {
            let matchAnalysisResult = []

            // TODO: cleanup. No need to forEach participants, calculate everything once.
            _.forEach(matchData["participantIdentities"], function (participant) {
                matchAnalysisResult.push(performAnalysis(matchData, participant["player"]["accountId"]))
            })

            return res.json(matchAnalysisResult).status(200).end();
        })
        .catch(error => {
            console.error(error)
        })
}

/**
 * Analyses a specific match from its data. Requires an accountId in order to calculate LP Gain.
 * <br/> This function has a complex behaviour and an in-depth description is on my TODO list.
 * @param matchData the matchId returned by Riot API
 * @param accountId the player-we-want-to-analyse's accountId
 * @returns {{error: string}|{teamAvgDeaths: number, playerKills: number, playerDeaths: number, teamComparedHealedGain: number, playerDamageTaken: number, teamAvgDamageDone: number, teamComparedDamageGain: number, teamComparedTankedGain: number, summonerName, championPlayed: string, playerAssists: number, teamComparedKA: number, teamAvgKA: number, teamComparedDeaths: number, teamComparedKAGain: number, teamAvgDamageTaken: number, playerKA: number, playerDamageDone: number, teamAvgHealed: number, lpGain: number, teamComparedDeathsGain: number, teamComparedBestDTH: unknown, winConditionGain: number, playerHealed: number}}
 */
const performAnalysis = (matchData, accountId) => {
    if (matchData["queueId"] !== 450)
        return {"error": "queueId was not ARAM"}

    const participantIdentity = _.find(matchData["participantIdentities"], {player: {accountId: accountId}})
    const participantId = participantIdentity["participantId"]
    const summonerName = participantIdentity["player"]["summonerName"]

    const participant = _.find(matchData["participants"], {participantId: participantId})
    const teamId = participant["teamId"]
    const win = participant["stats"]["win"]
    const championId = participant["championId"]
    const championName = getChampionNameById(championId)

    let allyTotalKills = 0, allyTotalDeaths = 0, allyTotalAssists = 0, allyTotalDamage = 0, allyTotalTanked = 0,
        allyTotalHealed = 0
    let playerKills = 0, playerDeaths = 0, playerAssists = 0, playerKA = 0, playerDamage = 0, playerTanked = 0,
        playerHealed = 0

    _.forEach(matchData["participants"], function (value) {
        if (value["teamId"] === teamId) {
            allyTotalKills += value["stats"]["kills"]
            allyTotalDeaths += value["stats"]["deaths"]
            allyTotalAssists += value["stats"]["assists"]

            allyTotalDamage += value["stats"]["totalDamageDealtToChampions"]
            allyTotalTanked += value["stats"]["totalDamageTaken"]
            allyTotalHealed += value["stats"]["totalHeal"]

            if (value["participantId"] === participantId) {
                playerKills = value["stats"]["kills"]
                playerDeaths = value["stats"]["deaths"]
                playerAssists = value["stats"]["assists"]

                playerKA = playerKills + playerAssists

                playerDamage = value["stats"]["totalDamageDealtToChampions"]
                playerTanked = value["stats"]["totalDamageTaken"]
                playerHealed = value["stats"]["totalHeal"]
            }

            //get raram rank, add to allyTotalRank
        } else {
            //get raram rank, add to enemyTotalRank
        }
    })

    const allyAvgDeaths = allyTotalDeaths / 5
    const allyAvgKA = (allyTotalKills + allyTotalAssists) / 5

    const allyAvgDamage = allyTotalDamage / 5
    const allyAvgTanked = allyTotalTanked / 5
    const allyAvgHealed = allyTotalHealed / 5

    const teamComparedDeaths = format((playerDeaths - allyAvgDeaths) / allyAvgDeaths)
    const teamComparedKA = format((playerKA - allyAvgKA) / allyAvgKA)

    const teamComparedDamage = (playerDamage - allyAvgDamage) / allyAvgDamage
    const teamComparedTanked = (playerTanked - allyAvgTanked) / allyAvgTanked
    const teamComparedHealed = (playerHealed - allyAvgHealed) / allyAvgHealed

    // Win condition
    const winGain = win ? 10 : -10

    // Kills + Assists compared to team average
    const teamComparedKAGain = limit(calculateGain(teamComparedKA, 10, 2))

    // Deaths compared to team average
    const teamComparedDeathsGain = limit(calculateGain(teamComparedDeaths)) * -1

    // Damage/Tanked/Healed compared to team average
    const teamComparedDamageGain = limit(calculateGain(teamComparedDamage))
    const teamComparedTankedGain = limit(calculateGain(teamComparedTanked))
    const teamComparedHealedGain = limit(calculateGain(teamComparedHealed))

    const teamComparedBestOfTDH = _.max([teamComparedDamageGain, teamComparedTankedGain, teamComparedHealedGain])

    let lpGain = winGain + teamComparedKAGain + teamComparedDeathsGain + teamComparedBestOfTDH
    lpGain = parseFloat(lpGain.toFixed(2))

    // Add LP to player, if he exists in DB.
    db.query('SELECT account_id FROM raram.users WHERE summoner_name = $1', [summonerName])
    .then(result => {
        if(result.rowCount !== 0)
            db.query('UPDATE raram.users SET lp = lp + $1 WHERE account_id = $2', [lpGain, result.rows[0]["account_id"]])
    })

    return {
        "summonerName": summonerName,
        "championPlayed": championName,
        "playerKills": playerKills,
        "playerDeaths": playerDeaths,
        "playerAssists": playerAssists,
        "playerKA": playerKA,
        "teamAvgKA": allyAvgKA,
        "teamAvgDeaths": allyAvgDeaths,
        "teamComparedKA": teamComparedKA,
        "teamComparedDeaths": teamComparedDeaths,
        "winConditionGain": winGain,
        "teamComparedDeathsGain": teamComparedDeathsGain,
        "teamComparedKAGain": teamComparedKAGain,
        "playerDamageDone": playerDamage,
        "playerDamageTaken": playerTanked,
        "playerHealed": playerHealed,
        "teamAvgDamageDone": allyAvgDamage,
        "teamAvgDamageTaken": allyAvgTanked,
        "teamAvgHealed": allyAvgHealed,
        "teamComparedDamageGain": teamComparedDamageGain,
        "teamComparedTankedGain": teamComparedTankedGain,
        "teamComparedHealedGain": teamComparedHealedGain,
        "teamComparedBestDTH": teamComparedBestOfTDH,
        "lpGain": lpGain,
    }

    // determine average of enemy team rank & ally team rank
    // if win  && avgEnemyRank > avgAllyRank: lp += getAmountOfDivisionsBetween(avgEnemyRank, avgAllyRank)
    // if lose && avgEnemyRank < avgAllyRank: lp -= getAmountOfDivisionsBetween(avgEnemyRank, avgAllyRank)

    // set lp from db.users to actual + lp-gain
    // add match.gameId, accountId, lp-gain to db.
}
