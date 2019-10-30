const Database = require('arangojs').Database
module.exports = {
  db: undefined,
  schemas: undefined,
  getDB: async function () {
    if (typeof this.db === 'undefined') {
      throw new Error('DB não inicializado')
    } else {
      return this.db
    }
  },
  createDB: async function (dataBase) {
    try {
      const db = await this.getDB()
      db.useDatabase('_system')
      return await db.createDatabase(dataBase)
    } catch (error) {
      if (error.errorNum !== 1207) {
        // console.error({ error })
        throw error
      }
      return error
    }
  },
  createCollection: async function (
    dataBase,
    collectionName,
    options = { waitForSync: true }
  ) {
    const db = await this.getDB()
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
      if (
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
    try {
      const db = await this.getDB()
      db.useDatabase('_system')
      return db.dropDatabase(database)
    } catch (error) {
      throw error
    }
  },
  dropCollection: async function (dataBase, collectionName, options = {}) {
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      let e = await collection.exists()
      if (e) {
        const result = await collection.drop(options)
        // console.log('drop - result',result )
      }
      return true
    } catch (error) {
      throw error
    }
  },
  createIndex: async function (dataBase, collectionName, index) {
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.createIndex(index)
    } catch (error) {
      throw error
    }
  },
  createHashIndex: async function (dataBase, collectionName, fields, opts = {}) {
    const db = await this.getDB()
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
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.save(doc, insetOptions)
    } catch (error) {
      // console.debug(error.errorNum, { error })
      if (error.message.indexOf('database not found') >= 0) {
        await this.createDB(dataBase)
        return this.create(dataBase, collectionName, doc)
      } else if (error.errorNum == 1203) {
        const wait = await this.createCollection(dataBase, collectionName)
        // console.log(wait)
        return this.create(dataBase, collectionName, doc)
      } else {
        // console.error(__filename, 'create', { error })
        throw error
      }
    }
  },
  update: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#update-by-example
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.updateByExample(bindVars, newValue, true, true)
    } catch (error) {
      // console.error({ error })
      throw error
    }
  },
  updateByID: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#update
    try {
      const options = {
        waitForSync: true,
        returnNew: true
      }
      let db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.update(bindVars, newValue, options)
    } catch (error) {
      // console.error({ error })
      throw error
    }
  },
  replace: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#replace-by-example
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.replaceByExample(bindVars, newValue, true)
    } catch (error) {
      // console.error({ error })
      throw error
    }
  },
  replaceByID: async function (dataBase, collectionName, bindVars, newValue) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#replace
    try {
      const options = {
        waitForSync: true,
        returnNew: true
      }
      let db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.replace(bindVars, newValue, options)
    } catch (error) {
      // console.error({ error })
      throw error
    }
  },
  delete: async function (dataBase, collectionName, bindVars) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#remove-by-example
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.removeByExample(bindVars, true)
    } catch (error) {
      // console.error({ error })
      throw error
    }
  },
  deleteByID: async function (dataBase, collectionName, key) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#remove
    try {
      const options = {
        waitForSync: true
      }
      let db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      return await collection.remove(key, options)
    } catch (error) {
      // console.error({ error })
      throw error
    }
  },
  findOne: async function (dataBase, collectionName, bindVars, options) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#query-by-example
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      let cursor = await collection.byExample(bindVars)
      if (cursor.count >= 1) {
        return cursor._result[0]
      } else {
        const msg = `Resultado não encontrado. DB[${dataBase}]/collection[${collectionName}]/bindVars[${JSON.stringify(
          bindVars
        )}]`
        let error = new Error(msg)
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
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      let cursor = await collection.byExample(bindVars)
      return await cursor.all()
    } catch (error) {
      throw error
    }
  },
  findByID: async function (dataBase, collectionName, bindVars) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#document
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      let cursor = await collection.document(bindVars)
      return cursor
    } catch (error) {
      throw error
    }
  },
  count: async function (dataBase, collectionName) {
    // https://docs.arangodb.com/3.3/Manual/DataModeling/Documents/DocumentMethods.html#count
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let collection = db.collection(collectionName)
      let cursor = await collection.count()
      return cursor.count
    } catch (error) {
      throw error
    }
  },
  query: async function (dataBase, query, bindVars) {
    //  https://docs.arangodb.com/3.0/AQL/Fundamentals/Syntax.html
    try {
      const db = await this.getDB()
      db.useDatabase(dataBase)
      let cursor = await db.query({ query: query, bindVars: bindVars })
      return await cursor.all()
    } catch (error) {
      throw error
    }
  },

  queryCursor: async function (dataBase, query, bindVars, options) {
    //  https://docs.arangodb.com/3.0/AQL/Fundamentals/Syntax.html
    try {
      let db = await this.getDB()
      db.useDatabase(dataBase)
      return db.query({ query, bindVars }, options)
    } catch (error) {
      throw error
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
      if (typeof config.connection === 'undefined') {
        throw new Error('Invalid Config')
      }
      const db = new Database(config.connection)
      db.useBasicAuth(config.auth.username, config.auth.password)
      this.db = db
      return db
    } catch (error) {
      throw error
    }
  }
}
