const { Pool } = require('pg')

pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
})

module.exports = {
    query: (text, params) => pool.query(text, params),
    getUserByAccountId: (params) => pool.query('SELECT * FROM raram.users WHERE account_id = $1', params),
    getMatchByIds: (params) => pool.query('SELECT * FROM raram.matches WHERE match_id = $1 AND account_id = $2', params),
    insertMatch: (params) => pool.query('INSERT INTO raram.matches(match_id, account_id, champion_id, date, lp_gain) VALUES($1, $2, $3, to_timestamp($4 / 1000.0), $5)', params),
    addPlayerLP: (params) => pool.query('UPDATE raram.users SET lp = lp + $2 WHERE account_id = $1', params),
}
