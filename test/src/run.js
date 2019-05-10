const expect = require('chai').expect
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
const arangodb = require('../../src/index')
const dataBase = 'testDB'
const collectionName = 'testCollectionName'
let doc1
let doc2
let doc3
describe('run', function () {
  it('insert doc 1', async function () {
    let docInsert = { a: 1, b: 2, c: 3 }
    let addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc1 = addDoc
    expect(doc1).to.be.a('object')
  })
  it('insert doc 2', async function () {
    let docInsert = { a: 1, b: 2, c: 4 }
    let addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc2 = addDoc
    expect(doc2).to.be.a('object')
  })
  it('insert doc 3', async function () {
    let docInsert = { j: 1 }
    let addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc3 = addDoc
    expect(doc3).to.be.a('object')
  })
  it('findOne', async function () {
    let bindVars = { a: 1, b: 2, c: 3 }
    let findDoc = await arangodb.findOne(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('find', async function () {
    let bindVars = { a: 1, b: 2 }
    let findDocs = await arangodb.find(dataBase, collectionName, bindVars)
    expect(findDocs).to.be.array()
  })
  it('find By ID - Object', async function () {
    let bindVars = { _id: doc1._id }
    let findDoc = await arangodb.findByID(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('find By ID - String', async function () {
    let bindVars = doc1._id
    let findDoc = await arangodb.findByID(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('find By Key', async function () {
    let bindVars = { _key: doc1._key }
    let findDoc = await arangodb.findByID(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('update doc', async function () {
    let bindVars = { a: 1, c: 3 }
    let newValue = { a: 2, d: 2 }
    let result = await arangodb.update(dataBase, collectionName, bindVars, newValue)
    expect(result).to.include({ updated: 1 })
  })
  it('update By ID', async function () {
    let bindVars = doc3._id
    let newValue = { k: 2, m: 2 }
    let result = await arangodb.updateByID(dataBase, collectionName, bindVars, newValue)
    expect(result).to.be.a('object')
  })
  it('replace doc', async function () {
    let bindVars = { a: 2, d: 2 }
    let newValue = { a: 1, x: 5 }
    let result = await arangodb.replace(dataBase, collectionName, bindVars, newValue)
    expect(result).to.include({ replaced: 1 })
  })
  it('replace By ID', async function () {
    let bindVars = doc3._id
    let newValue = { a: 1, x: 5 }
    let result = await arangodb.replaceByID(dataBase, collectionName, bindVars, newValue)
    expect(result).to.be.a('object')
  })
  it('count', async function () {
    let result = await arangodb.count(dataBase, collectionName)
    expect(result).to.be.a('number')
  })
  it('query', async function () {
    let bindVars = { a: 1 }
    let query = `FOR d in ${collectionName} FILTER d.a == @a RETURN d`
    let result = await arangodb.query(dataBase, query, bindVars)
    expect(result).to.be.a('array')
  })
  it('delete By ID', async function () {
    let bindVars = doc3._id
    let result = await arangodb.deleteByID(dataBase, collectionName, bindVars)
    expect(result).to.be.a('object')
  })
  it('delete', async function () {
    let bindVars = { a: 1 }
    let result = await arangodb.delete(dataBase, collectionName, bindVars)
    expect(result).to.include({ deleted: 2 })
  })
})
