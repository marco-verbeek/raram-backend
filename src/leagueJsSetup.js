const LeagueJS = require('leaguejs')

process.env.LEAGUE_API_PLATFORM_ID = process.env.LEAGUE_API_PLATFORM_ID ?? "euw1"

exports.leagueJs = new LeagueJS(
    process.env.LEAGUE_API_KEY,
    {
        caching: {
            isEnabled: true,
            defaults: {stdTTL: 120}
        }
    }
)
