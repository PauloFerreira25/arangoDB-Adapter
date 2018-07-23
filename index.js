const Database = require('arangojs').Database
module.exports = {
  db: undefined,
  getDB: async function () {
    if (typeof this.db === 'undefined') {
      throw new Error('DB não inicializado')
    } else {
      return this.db
    }
  },
  createDB: async function (dataBase) {
    try {
      let db = await this.getDB()
      db.useDatabase('_system')
      return await db.createDatabase(dataBase)
    } catch (error) {
      throw error
    }
  },
  createCollection: async function (dataBase, collectionName) {
    try {
      let db = await this.getDB()
      let collection = db.collection(collectionName)
      return await collection.create()
    } catch (error) {
      throw error
    }
  },
  insert: async function (dataBase, collectionName, doc) {
    try {
      let db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.save(doc)
    } catch (error) {
      if (error.message.indexOf('database not found') >= 0) {
        await this.createDB(dataBase)
        return this.insert(dataBase, collectionName, doc)
      } else if (error.message.indexOf('collection not found') >= 0) {
        await this.createCollection(dataBase, collectionName)
        return this.insert(dataBase, collectionName, doc)
      } else {
        console.log(error)
        throw error
      }
    }
  },
  init: async function (config) {
    try {
      if (typeof config === 'undefined') {
        throw new Error('Invalid Config')
      }
      if (typeof config.connection === 'undefined') {
        throw new Error('Invalid Config')
      }
      let db = new Database(config.connection)
      db.useBasicAuth(config.auth.username, config.auth.password)
      this.db = db
      return db
    } catch (error) {
      throw error
    }
  }
}
