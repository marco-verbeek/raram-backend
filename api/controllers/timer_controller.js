const db = require('../../src/database')
const { leagueJs } = require('../../src/league')

exports.overview_timer = async function (req, res) {
  const summonerData = await leagueJs.Summoner.gettingByName(req.params.name)
  const accountId = summonerData['accountId']

  const timer = await db.getUserTimer([accountId])

  if (timer.rowCount === 0)
    return res.json({ 'error': 'Could not find a timer linked to this user' }).status(500).end()

  const timerInfo = {
    date: timer.rows[0]['raram_date'],
    amount: timer.rows[0]['raram_amount'],
  }

  return res.json(timerInfo).status(200).end()
}

exports.set_timer = async function (req, res) {
  const value = parseInt(req.body.value)

  if (req.body.value === undefined || isNaN(value))
    return res.json({ 'error': 'Missing or incorrect value parameter' }).status(500).end()

  const summonerData = await leagueJs.Summoner.gettingByName(req.params.name)
  const accountId = summonerData['accountId']

  const timer = await db.getUserTimer([accountId])

  if (timer.rowCount === 0)
    return res.json({ 'error': 'Could not find a timer linked to this user' }).status(500).end()

  if (value === 0) {
    await db.updateStopTimer([accountId])
  } else {
    const current_amount = timer.rows[0]['raram_amount']

    if (current_amount === 0 && value > 0)
      await db.updateTimerDate([accountId])

    const addedValue = (current_amount + value) > 0 ? value : current_amount * -1
    await db.updateTimerGames([accountId, addedValue])
  }

  return res.json({ 'success': 'The timer has successfully been updated' }).status(200).end()
}