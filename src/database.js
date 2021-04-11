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
}