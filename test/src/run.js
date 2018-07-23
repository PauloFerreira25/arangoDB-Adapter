const expect = require('chai').expect
const arangodb = require('../../index')
const dataBase = 'testDB'
const collectionName = 'testCollectionName'
let doc
describe('run', function () {
  it('insert doc', async function () {
    let docInsert = {
      a: 1,
      b: 2
    }
    let addDoc = await arangodb.insert(dataBase, collectionName, docInsert)
    doc = addDoc
    expect(doc).to.be.a('object')
  })
  it('update doc', async function () {
    let docInsert = {
      a: 1,
      b: 2
    }
    let addDoc = await arangodb.insert(dataBase, collectionName, docInsert)
    doc = addDoc
    expect(doc).to.be.a('object')
  })
})
