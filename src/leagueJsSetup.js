const LeagueJS = require('leaguejs')

exports.leagueJs = new LeagueJS(
    process.env.LEAGUE_API_KEY,
    {
        caching: {
            isEnabled: true,
            defaults: {stdTTL: 120}
        }
    }
)
