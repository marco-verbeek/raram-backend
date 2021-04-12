'use strict'
require('dotenv').config()

const _ = require('lodash');
const db = require("../../src/database");

const {limit, calculateGain, getChampionNameById, format, performMatchAnalysis} = require("../../utils/analysis_helper")
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
        return res.json(performMatchAnalysis(matchData)).status(200).end();
    })
    .catch(err => {
        console.log(err)
        return res.json({"error": "Could not find summoner by name"}).status(500).end()
    })
}