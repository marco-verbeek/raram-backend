const db = require("../../src/database")
const {getRandomIcons} = require("../../utils/verification_helper");

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
    const accountId = '_LtStkq6nDAuthlcw8ns0c_SRdnyuoguzmLIAmyL5YVF_g'
    const iconIds = getRandomIcons()

    db.query('SELECT * FROM raram.verifications WHERE account_id = $1', [accountId])
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
}

exports.icon_verify = function (req, res){
    // check in db if ongoing verification
    // if not, stop
    // verify if there is an icon left to verify
    // if there is, iterate over them and verify if current player icon == iconId
    // if it is, indicate true to that icon verified
}