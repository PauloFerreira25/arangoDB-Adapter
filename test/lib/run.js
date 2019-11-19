const expect = require('chai').expect
const chai = require('chai')
const assertArrays = require('chai-arrays')
const arangodb = require('../../src/index')
const dataBase = 'testDB'
const collectionName = 'testCollectionName'
chai.use(assertArrays)
let doc1
let doc2
let doc3
let doc4
describe('run', function () {
  it('insert doc 1', async function () {
    const docInsert = { a: 1, b: 2, c: 3 }
    const addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc1 = addDoc.new
    expect(doc1).to.include(docInsert)
  })
  it('insert doc 2', async function () {
    const docInsert = { a: 1, b: 2, c: 4 }
    const addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc2 = addDoc.new
    expect(doc2).to.include(docInsert)
  })
  it('insert doc 3', async function () {
    const docInsert = { j: 1 }
    const addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc3 = addDoc.new
    expect(doc3).to.include(docInsert)
  })
  it('insert doc 4', async function () {
    const docInsert = { z: 1, x: [{ a: 1, b: 2 }, { a: 4 }] }
    const addDoc = await arangodb.create(dataBase, collectionName, docInsert)
    doc4 = addDoc.new
    expect(doc4).to.deep.include(docInsert)
  })
  it('findOne', async function () {
    const bindVars = { a: 1, b: 2, c: 3 }
    const findDoc = await arangodb.findOne(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('find', async function () {
    const bindVars = { a: 1, b: 2 }
    const findDocs = await arangodb.find(dataBase, collectionName, bindVars)
    expect(findDocs).to.be.array()
  })
  it('find By ID - Object', async function () {
    const bindVars = { _id: doc1._id }
    const findDoc = await arangodb.findByID(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('find By ID - String', async function () {
    const bindVars = doc1._id
    const findDoc = await arangodb.findByID(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('find By Key', async function () {
    const bindVars = { _key: doc1._key }
    const findDoc = await arangodb.findByID(dataBase, collectionName, bindVars)
    expect(findDoc).to.deep.equal(doc1)
  })
  it('update doc', async function () {
    const bindVars = { a: 1, c: 3 }
    const newValue = { a: 2, d: 2 }
    const result = await arangodb.update(
      dataBase,
      collectionName,
      bindVars,
      newValue
    )
    expect(result).to.include({ updated: 1 })
  })
  it('update By ID', async function () {
    const bindVars = doc3._id
    const newValue = { k: 2, m: 2 }
    const result = await arangodb.updateByID(
      dataBase,
      collectionName,
      bindVars,
      newValue
    )
    expect(result).to.be.a('object')
  })
  it('replace doc', async function () {
    const bindVars = { a: 2, d: 2 }
    const newValue = { a: 1, x: 5 }
    const result = await arangodb.replace(
      dataBase,
      collectionName,
      bindVars,
      newValue
    )
    expect(result).to.include({ replaced: 1 })
  })
  it('replace By ID', async function () {
    const bindVars = doc3._id
    const newValue = { a: 1, x: 5 }
    const result = await arangodb.replaceByID(
      dataBase,
      collectionName,
      bindVars,
      newValue
    )
    expect(result).to.be.a('object')
  })
  it('count', async function () {
    const result = await arangodb.count(dataBase, collectionName)
    expect(result).to.be.a('number')
  })
  it('query', async function () {
    const bindVars = { a: 1 }
    const query = `FOR d in ${collectionName} FILTER d.a == @a RETURN d`
    const result = await arangodb.query(dataBase, query, bindVars)
    expect(result).to.be.a('array')
  })
  it('delete By ID', async function () {
    const bindVars = doc3._id
    const result = await arangodb.deleteByID(
      dataBase,
      collectionName,
      bindVars
    )
    expect(result).to.be.a('object')
  })
  it('delete', async function () {
    const bindVars = { a: 1 }
    const result = await arangodb.delete(dataBase, collectionName, bindVars)
    expect(result).to.include({ deleted: 2 })
  })
})
