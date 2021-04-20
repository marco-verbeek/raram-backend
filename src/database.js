const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
})

// Is there any way to make this query more robust ?
const UPDATE_PLAYER_STATS_QUERY = 'UPDATE raram.stats SET ' +
  'kills = kills + $2,' +
  'deaths = deaths + $3,' +
  'assists = assists + $4,' +
  'games_won = games_won + $5,' +
  'games_played = games_played + 1,' +
  'damage_done = damage_done + $6,' +
  'damage_taken = damage_taken + $7,' +
  'healed = healed + $8,' +
  'double_kills = double_kills + $9,' +
  'triple_kills = triple_kills + $10,' +
  'quadra_kills = quadra_kills + $11,' +
  'penta_kills = penta_kills + $12,' +
  'gold_earned = gold_earned + $13,' +
  'gold_spent = gold_spent + $14,' +
  'minions_killed = minions_killed + $15,' +
  'first_bloods = first_bloods + $16,' +
  'longest_alive = CASE WHEN $17 > longest_alive THEN $17 ELSE longest_alive END,' +
  'current_winstreak = CASE WHEN $5 > 0 THEN current_winstreak + 1 ELSE 0 END ' +
  'WHERE account_id = $1'

module.exports = {
    query: (text, params) => pool.query(text, params),

    insertUser: (params) => pool.query('INSERT INTO raram.users(summoner_name, account_id) VALUES($1, $2)', params),
    insertMatch: (params) => pool.query('INSERT INTO raram.matches(match_id, account_id, champion_id, date, lp_gain) VALUES($1, $2, $3, to_timestamp($4 / 1000.0), $5)', params),
    insertVerification: (params) => pool.query('INSERT INTO raram.verifications(account_id, icons) VALUES($1, $2)', params),
    insertStats: (params) => pool.query('INSERT INTO raram.stats(account_id) VALUES($1)', params),

    getUserByAccountId: (params) => pool.query('SELECT * FROM raram.users WHERE account_id = $1', params),
    getMatchByIds: (params) => pool.query('SELECT * FROM raram.matches WHERE match_id = $1 AND account_id = $2', params),
    getSummonerByName: (params) => pool.query('SELECT summoner_name, lp FROM raram.users WHERE summoner_name = $1', params),
    getVerificationFromId: (params) => pool.query('SELECT * FROM raram.verifications WHERE account_id = $1', params),
    getRecentMatches: (params) => pool.query('SELECT * FROM raram.matches WHERE account_id = $1', params),
    getUserTimer: (params) => pool.query('SELECT raram_date, raram_amount FROM raram.users WHERE account_id = $1', params),

    updatePlayerLP: (params) => pool.query('UPDATE raram.users SET lp = (SELECT SUM(lp_gain) FROM raram.matches WHERE account_id = $1) WHERE account_id = $1', params),
    updateVerificationIconsById: (params) => pool.query('UPDATE raram.verifications SET icons=$2 WHERE account_id = $1', params),
    updatePlayerStats: (params) => pool.query(UPDATE_PLAYER_STATS_QUERY, params),
    updateHighestWinstreak: (params) => pool.query('UPDATE raram.stats SET highest_winstreak = CASE WHEN current_winstreak >= highest_winstreak THEN current_winstreak ELSE highest_winstreak END WHERE account_id = $1', params),

    updateTimerGames: (params) => pool.query('UPDATE raram.users SET raram_amount = raram_amount + $2 WHERE account_id = $1', params),
    updateStopTimer: (params) => pool.query('UPDATE raram.users SET raram_amount = 0 WHERE account_id = $1', params),
    updateTimerDate: (params) => pool.query('UPDATE raram.users SET raram_date = current_timestamp WHERE account_id = $1', params),
}