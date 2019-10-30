const expect = require('chai').expect
const arangodb = require('../../src/index')
const dataBase = 'testDB'
const collectionName = 'testCollectionName'
describe('end', function () {
  describe('Drop Datas', function () {
    it('Drop Collection', async function () {
      const result = await arangodb.dropCollection(dataBase, collectionName)
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.true
    })
    it('Drop Database', async function () {
      const result = await arangodb.dropDatabase(dataBase)
      expect(result).to.include({ error: false, code: 200, result: true })
    })
    it('Drop Database', async function () {
      try {
        await arangodb.dropDatabase('dataBase')
      } catch (error) {
        expect(error).to.include({ isArangoError: true })
      }
    })
  })
})
