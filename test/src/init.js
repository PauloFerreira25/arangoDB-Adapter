const expect = require('chai').expect
const arangodb = require('../../index')
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
    let config = {
      connection: {
        url: 'http://127.0.0.1:8529'
      },
      auth: {
        username: 'test',
        password: 'test123'
      }
    }
    let init = await arangodb.init(config)
    expect(init).to.be.a('object')
  })
  it('Test DB existe', async function () {
    let db = await arangodb.getDB()
    expect(db).to.be.a('object')
  })
})
