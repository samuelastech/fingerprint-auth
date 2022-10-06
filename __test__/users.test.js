const request = require('supertest')
const app = require('../app')
const factory = require('./factories')

const database = require('./database')
const databaseName = 'users'

beforeEach(async () => {
  await database.connect(databaseName)
})

afterEach(async () => {
  await database.close()
})

describe('this is a set of tests', () => {
  it('is a unique test', async () => {
    await factory.create('User', { password: '123123' })
    request(app).get('/')
  })
})
