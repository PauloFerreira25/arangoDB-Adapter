const expect = require('chai').expect
const arangodb = require('../../src/index')
const ProxyAgent = require('proxy-agent')
const dataBase = 'testDB'
describe('init', function () {
  it('Test DB não inicializado', async function () {
    try {
      await arangodb.getConnection()
    } catch (error) {
      expect(function () {
        throw error
      }).to.throw('Connection não inicializado')
    }
  })
  it('Iniciar o arangoDB', async function () {
    const config = {
      proxy: true, // Liga ou desliga o uso de proxy
      connection: {
        url: 'http://ec2-3-15-32-117.us-east-2.compute.amazonaws.com:8529'
      },
      auth: {
        username: 'test',
        password: 'geysa123'
      },
      schemas: {
        testCollectionName: {
          options: {},
          indexes: [{}]
        }
      }
    }
    if (config.proxy) {
      const proxyUri = process.env.http_proxy
      config.connection.agent = new ProxyAgent(proxyUri)
    }
    const init = await arangodb.init(config)
    expect(init).to.be.a('object')
  })
  it('Test Connection existe', async function () {
    const db = await arangodb.getConnection()
    expect(db).to.be.a('object')
  })
  it('Create DataBase', async function () {
    const db = await arangodb.createDB(dataBase)
    // eslint-disable-next-line no-unused-expressions
    expect(db).to.be.true
  })
  it('Create DataBase - Again', async function () {
    const db = await arangodb.createDB(dataBase)
    // eslint-disable-next-line no-unused-expressions
    expect(db).to.be.false
  })
})
