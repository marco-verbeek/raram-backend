const app = require('../src/index')
const request = require('supertest')
const { getChampionNameById } = require('../utils/analysis_helper')

it('finds champions by their id', () => {
  expect(getChampionNameById(266)).toBe('Aatrox')
  expect(getChampionNameById(143)).toBe('Zyra')
})

it('returns valid json data from analysed match', () => {
  return request(app).get('/api/analysis').then(response => {
    expect(response.statusCode).toBe(200)
  })
})