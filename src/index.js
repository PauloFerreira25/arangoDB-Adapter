const Database = require('arangojs').Database
module.exports = {
  connection: undefined,
  schemas: undefined,
  getConnection: async function () {
    if (typeof this.connection === 'undefined') {
      throw new Error('Connection não inicializado')
    } else {
      return this.connection
    }
  },
  createDB: async function (dataBase) {
    try {
      const db = await this.getConnection()
      const check = await this.existDB(dataBase)
      if (check === false) {
        await db.useDatabase('_system')
        await db.createDatabase(dataBase)
        return true
      } else {
        return false
      }
    } catch (error) {
      if (error.errorNum === 1207) {
        return false
      } else { throw error }
    }
  },
  existDB: async function (dataBase) {
    try {
      const db = await this.getConnection()
      await db.useDatabase('_system')
      const dbList = await db.listDatabases()
      const indexDB = dbList.indexOf(dataBase)
      if (indexDB > -1) {
        return true
      } else {
        return false
      }
    } catch (error) {
      if (error.errorNum === 1207) {
        return false
      } else { throw error }
    }
  },
  createCollection: async function (
    dataBase,
    collectionName,
    options = { waitForSync: true }
  ) {
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    const e = await collection.exists()
    // console.log({e})
    if (!e) {
      // console.log('{!e}', collectionName)
      if (
        this.schemas &&
        this.schemas[collectionName] &&
        this.schemas[collectionName].options
      ) {
        options = Object.assign(options, this.schemas[collectionName].options)
      }
      await collection.create(options)
      // console.log(this.schemas)
      if (
        this.schemas &&
        this.schemas[collectionName] &&
        this.schemas[collectionName].indexes &&
        Array.isArray(this.schemas[collectionName].indexes)
      ) {
        const pall = this.schemas[collectionName].indexes.map(e => {
          if (e.type === 'hash') {
            this.createHashIndex(dataBase, collectionName, e.fields, e.opts)
          }
        })
        await Promise.all(pall)
      }
    }
    // console.log('{e}', collectionName)
    return true
  },
  dropDatabase: async function (database) {
    const db = await this.getConnection()
    db.useDatabase('_system')
    return db.dropDatabase(database)
  },
  dropCollection: async function (dataBase, collectionName, options = {}) {
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    const e = await collection.exists()
    if (e) {
      await collection.drop(options)
    }
    return true
  },
  createIndex: async function (dataBase, collectionName, index) {
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.createIndex(index)
  },
  createHashIndex: async function (dataBase, collectionName, fields, opts = {}) {
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.createHashIndex(fields, opts)
  },

  create: async function (
    dataBase,
    collectionName,
    doc,
    insetOptions = { waitForSync: true, returnNew: true }
  ) {
    try {
      const db = await this.getConnection()
      db.useDatabase(dataBase)
      const collection = db.collection(collectionName)
      // console.debug('collection', { collection })
      return await collection.save(doc, insetOptions)
    } catch (error) {
      // console.debug(error.errorNum, { error })
      if (error.message.indexOf('database not found') >= 0) {
        await this.createDB(dataBase)
        const data = await this.create(dataBase, collectionName, doc)
        return data
      } else if (parseInt(error.errorNum) === 1203) {
        await this.createCollection(dataBase, collectionName)
        const data = await this.create(dataBase, collectionName, doc)
        return data
      } else {
        throw error
      }
    }
  },
  update: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#update-by-example
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.updateByExample(bindVars, newValue, true, true)
  },
  updateByID: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#update
    const options = {
      waitForSync: true,
      returnNew: true
    }
    // abc
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.update(bindVars, newValue, options)
  },
  replace: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#replace-by-example
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.replaceByExample(bindVars, newValue, true)
  },
  replaceByID: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#replace

    const options = {
      waitForSync: true,
      returnNew: true
    }
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.replace(bindVars, newValue, options)
  },
  delete: async function (dataBase, collectionName, bindVars) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#remove-by-example
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.removeByExample(bindVars, true)
  },
  deleteByID: async function (dataBase, collectionName, key) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#remove
    const options = {
      waitForSync: true
    }
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    return collection.remove(key, options)
  },
  findOne: async function (dataBase, collectionName, bindVars, options) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#query-by-example
    try {
      const db = await this.getConnection()
      db.useDatabase(dataBase)
      const collection = db.collection(collectionName)
      const cursor = await collection.byExample(bindVars)
      if (cursor.count >= 1) {
        return cursor._result[0]
      } else {
        const msg = `Resultado não encontrado. DB[${dataBase}]/collection[${collectionName}]/bindVars[${JSON.stringify(
          bindVars
        )}]`
        const error = new Error(msg)
        throw error
      }
    } catch (error) {
      if (error && error.isArangoError && options) {
        if (error.response.body.errorNum === 1203 && options.orBlank) {
          return {}
        }
      }
      throw error
    }
  },
  find: async function (dataBase, collectionName, bindVars, options) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#query-by-example
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    const cursor = await collection.byExample(bindVars)
    return cursor.all()
  },
  findByID: async function (dataBase, collectionName, bindVars) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#document
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    const cursor = await collection.document(bindVars)
    return cursor
  },
  count: async function (dataBase, collectionName) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#count
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const collection = db.collection(collectionName)
    const cursor = await collection.count()
    return cursor.count
  },
  query: async function (dataBase, query, bindVars) {
    //  https://docs.arangodb.com/3.0/AQL/Fundamentals/Syntax.html
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    const cursor = await db.query({ query: query, bindVars: bindVars })
    return cursor.all()
  },
  queryCursor: async function (dataBase, query, bindVars, options) {
    //  https://docs.arangodb.com/3.0/AQL/Fundamentals/Syntax.html
    const db = await this.getConnection()
    db.useDatabase(dataBase)
    return db.query({ query, bindVars }, options)
  },

  init: async function (config) {
    if (typeof config === 'undefined') {
      throw new Error('Invalid Config')
    }
    if (typeof config.connection === 'undefined') {
      throw new Error('Invalid Config')
    }
    if (typeof config.connection === 'undefined') {
      throw new Error('Invalid Config')
    }
    const db = new Database(config.connection)
    db.useBasicAuth(config.auth.username, config.auth.password)
    this.connection = db
    this.schemas = config.schemas || {}
    return db
  }
}
