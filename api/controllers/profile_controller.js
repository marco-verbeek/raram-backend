const db = require("../../src/database")

const {getRandomIcons, removeIfContained} = require("../../utils/verification_helper");
const {leagueJs} = require('../../src/leagueJS_setup')

exports.profile_summary = function (req, res){
    const summonerName = req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty"

    db.getSummonerByName([summonerName])
    .then(result => {
        if(result.rowCount === 0)
            return res.json({error: "Could not find player profile"}).status(500).end()

        const data = {
            "summonerName": result.rows[0]["summoner_name"],
            "lp": result.rows[0]["lp"]
        }

        return res.json(data).status(200).end()
    })
}

exports.profile_verify = function (req, res){
    const summonerName = req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty"
    const alreadyVerified = req.query.verified ?? false

    const iconIds = getRandomIcons()
    let accountId = ''

    if(alreadyVerified)
        return res.json({"error": "This profile has already been locally verified"}).status(200).end()

    leagueJs.Summoner.gettingByName(summonerName)
    .then(result => {
        accountId = result["accountId"]

        return db.getVerificationFromId([accountId])
    })
    .then(result => {
        if(result.rowCount !== 0)
            return db.updateVerificationIconsById([accountId, iconIds])
        return db.insertVerification([accountId, iconIds])
    })
    .then(result => {
        if(result.rowCount !== 1)
            return res.json({"error": "could not add verification in database"}).status(500).end()

        return res.json({"icons": iconIds}).status(200).end()
    })
    .catch(() => {
        return res.json({"error": "Could not find summoner by name"}).status(500).end()
    })
}

exports.icon_verify = function (req, res){
    const summonerName = req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty"
    const alreadyVerified = req.query.verified ?? false
    let currentIconId = 0, accountId

    if(alreadyVerified)
        return res.json({"error": "This profile has already been locally verified"}).status(200).end()

    leagueJs.Summoner.gettingByName(summonerName)
    .then(result => {
        currentIconId = result["profileIconId"]
        accountId = result["accountId"]

        return db.getVerificationFromId([accountId])
    })
    .then(result => {
        if(result.rowCount === 0)
            return res.json({"error": "Could not find verification for this summoner. Have you started a verification process?"}).status(500).end()

        const iconIdsLeft = {
            "icons": removeIfContained(result.rows[0]["icons"], parseInt(currentIconId)),
            "currentIconId": currentIconId
        }

        db.updateVerificationIconsById([accountId, iconIdsLeft.icons])
        .then(() => {
            if(result.rowCount !== 1)
                return res.json({"error": "could not update icon verification in database"}).status(500).end()

            if(iconIdsLeft.icons.length === 0)
                db.insertUser([summonerName, accountId])

            return res.json(iconIdsLeft).status(200).end()
        })
    })
    .catch(() => {
        return res.json({"error": "Could not find summoner by name"}).status(500).end()
    })
}
