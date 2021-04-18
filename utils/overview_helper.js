/**
 * Nicely formats recent games for the overview endpoint.
 * @param amount integer representing how many rows the db returned
 * @param rows returned from a SELECT on raram.matches, represents an array of games
 * @returns [{championId: integer, lpGain: integer, date: timestamp}]
 */
exports.getRecentMatches = (amount, rows) => {
    const matches = []

    for(let i=0; i<amount; i++){
        const match = {}

        match["championId"] = rows[i]["champion_id"]
        match["lpGain"] = rows[i]["lp_gain"]
        match["date"] = rows[i]["date"]

        matches.push(match)
    }

    return matches
}