const expect = require('chai').expect
const arangodb = require('../../src/index')
describe('init', function () {
  it('Test DB não inicializado', async function () {
    try {
      await arangodb.getDB()
    } catch (error) {
      expect(function () {
        throw error
      }).to.throw('DB não inicializado')
    }
  })
  it('Iniciar o arangoDB', async function () {
    const config = {
      connection: {
        url: 'http://doha.com.br:8529/'
      },
      auth: {
        username: 'test',
        password: 'geysa123'
      }
    }
    const init = await arangodb.init(config)
    expect(init).to.be.a('object')
  })
  it('Test DB existe', async function () {
    const db = await arangodb.getDB()
    expect(db).to.be.a('object')
  })
})
