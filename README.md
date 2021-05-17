[![CodeFactor](https://www.codefactor.io/repository/github/marco-verbeek/raram-backend/badge)](https://www.codefactor.io/repository/github/marco-verbeek/raram-backend)
# Ranked ARAM Tool
Spare-time created tool, calculates how much LP you would have gained if the ARAM was "Ranked".
Uses the Riot API in order to get recent match data. Only analyses ARAM games.

LP gain is saved to a PgSQL database in order to determine a rank. Account needs to be linked by selecting specific raram-selected icons to prove account ownership.

LP is calculated by:
- team-compared player damage done, taken or healed (NB: only best one is selected and effectively compared and has an impact on LP, to account for supports like Yuumi that do not deal nor take damage.)
- team compared Kill Participation, which boils down to a kills + assists comparison.
- team-compared Deaths

Endpoints:
GET /api/analysis?name={summonerName}
GET /api/profile
GET /api/profile/summary
POST /api/profile/verificon

!! This tool is not maintainted anymore, as Riot has not responded yet to our mail.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development (uses Nodemon)
```
npm start
```

### Run tests (Uses Jest & Supertest)
```
npm test
```

### Configuration
This project requires a PostgreSQL database. Originally created with PgSQL v12.3.
<br/>Import the db_init.sql file located in the data folder.

Please create a .env file with following variables:

| VARIABLE | DEFAULT VALUE | DESCRIPTION
|:----------:|:----------:|:----------:
| LEAGUE_API_KEY | none | Your Riot API Key
| LEAGUE_API_PLATFORM_ID | euw1 | Riot API Region ID
| DEFAULT_SUMMONER_NAME | none | Default name used if none specified during GET /api/analysis
| PORT | 5000 | ExpressJS Server Port
| DB_USER | postgres | PgSQL Username
| DB_PASSWORD | none | PgSQL Password
| DB_PORT | 5432 | PgSQL Port

