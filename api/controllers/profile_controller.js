const db = require("../../src/database")

const {getRandomIcons, removeIfContained} = require("../../utils/verification_helper");
const {leagueJs} = require('../../src/leagueJS_setup')

exports.profile_summary = function (req, res){
    const summonerName = req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty"

    db.query('SELECT summoner_name, lp FROM raram.users WHERE summoner_name = $1', [summonerName])
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
    const iconIds = getRandomIcons()

    leagueJs.Summoner.gettingByName(summonerName)
    .then(result => {
        const accountId = result["accountId"]

        return db.query('SELECT * FROM raram.verifications WHERE account_id = $1', [accountId])
    })
    .then(result => {
        if(result.rowCount !== 0)
            return db.query('UPDATE raram.verifications SET icons=$2 WHERE account_id = $1', [accountId, iconIds])
        return db.query('INSERT INTO raram.verifications(account_id, icons) VALUES($1, $2)', [accountId, iconIds])
    })
    .then(result => {
        if(result.rowCount !== 1)
            return res.json({"error": "could not add verification in database"}).status(500).end()

        const icons = [
            {
                "iconId": iconIds[0],
                "verified": false
            },
            {
                "iconId": iconIds[1],
                "verified": false
            },
            {
                "iconId": iconIds[2],
                "verified": false
            }
        ]

        return res.json(icons).status(200).end()
    })
    .catch(() => {
        return res.json({"error": "Could not find summoner by name"}).status(500).end()
    })
}

exports.icon_verify = function (req, res){
    const summonerName = req.query.name ?? process.env.DEFAULT_SUMMONER_NAME ?? "ItsNexty"
    let currentIconId = 0, accountId

    leagueJs.Summoner.gettingByName(summonerName)
    .then(result => {
        currentIconId = result["profileIconId"]
        accountId = result["accountId"]

        return db.query('SELECT icons FROM raram.verifications WHERE account_id = $1', [accountId])
    })
    .then(result => {
        if(result.rowCount === 0)
            return res.json({"error": "Could not find verification for this summoner. Have you started a verification process?"}).status(500).end()

        const iconIdsLeft = {
            "icons": removeIfContained(result.rows[0]["icons"], parseInt(currentIconId)),
            "currentIconId": currentIconId
        }

        db.query('UPDATE raram.verifications SET icons = $1 WHERE account_id = $2', [iconIdsLeft.icons, accountId])
        .then(() => {
            if(result.rowCount !== 1)
                return res.json({"error": "could not update icon verification in database"}).status(500).end()

            return res.json(iconIdsLeft).status(200).end()
        })
    })
    .catch(() => {
        return res.json({"error": "Could not find summoner by name"}).status(500).end()
    })
}