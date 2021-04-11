# Ranked ARAM Tool
Spare-time created tool with friends.

"Compare your performance to your team's using rARAM.gg!"


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
Please create a .env file with following variables:

| VARIABLE | DEFAULT VALUE | DESCRIPTION
|:----------:|:----------:|:----------:
| LEAGUE_API_KEY | none | Your Riot API Key
| LEAGUE_API_PLATFORM_ID | euw1 | Riot API Region ID
| DEFAULT_SUMMONER_NAME | ItsNexty | Default name used if none specified during GET /api/analysis
| PORT | 5000 | ExpressJS Server Port

