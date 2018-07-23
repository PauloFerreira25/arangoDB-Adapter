// const Database = require('arangojs').Database
// let db

// const init = function (config) {
//   return new Promise(function (resolve, reject) {
//     if (typeof config === 'undefined') {
//       reject(new Error('Invalid Config'))
//     }
//     try {
//       db = new Database(config)
//       db.useBasicAuth(config.username, config.password)
//       resolve(db)
//     } catch (err) {
//       console.error(err)
//       reject(err)
//     }
//   })
// }

// const save = (dataBase, collectionName, doc) => new Promise((resolve, reject) => {
//   db.useDatabase(dataBase)
//   let collection = db.collection(collectionName)
//   collection.save(doc).then(d => {
//     resolve(d)
//   }).catch(err => {
//     if (err.message.indexOf('collection not found') >= 0) {
//       collection.create().then(c => {
//         save(dataBase, collectionName, doc).then(r => resolve(r)).catch(err => reject(err))
//       }).catch(err => reject(err))
//     } else if (err.message.indexOf('database not found') >= 0) {
//       db.useDatabase('_system')
//       db.createDatabase(dataBase).then(b => {
//         db.useDatabase(dataBase)
//         collection.create().then(c => {
//           save(dataBase, collectionName, doc).then(r => resolve(r)).catch(err => reject(err))
//         }).catch(err => reject(err))
//       }).catch(err => {
//         reject(err)
//       })
//     } else {
//       reject(err)
//     }
//   })
// })

// const update = (dataBase, collectionName, query, doc, options = { upsert: true }) => new Promise((resolve, reject) => {
//   db.useDatabase(dataBase)
//   let collection = db.collection(collectionName)
//   delete doc._key
//   delete doc._id
//   delete doc._rev
//   collection.update(query, doc).then(d => {
//     resolve(d)
//   }).catch(err => {
//     if (err.message.indexOf('collection not found') >= 0) {
//       collection.create().then(c => {
//         save(dataBase, collectionName, doc).then(r => resolve(r)).catch(err => reject(err))
//       }).catch(err => reject(err))
//     } else if (err.message.indexOf('database not found') >= 0) {
//       db.useDatabase('_system')
//       db.createDatabase(dataBase).then(b => {
//         db.useDatabase(dataBase)
//         collection.create().then(c => {
//           save(dataBase, collectionName, doc).then(r => resolve(r)).catch(err => reject(err))
//         }).catch(err => reject(err))
//       }).catch(err => {
//         reject(err)
//       })
//     } else {
//       reject(err)
//     }
//   })
// })

// const deleteP = (dataBase, collectionName, doc) => new Promise((resolve, reject) => {
//   db.useDatabase(dataBase)
//   let collection = db.collection(collectionName)
//   collection.remove(doc).then(d => {
//     resolve(d)
//   }).catch(err => {
//     reject(err)
//   })
// })

// const getAll = (dataBase, collectionName) => new Promise((resolve, reject) => {
//   db.useDatabase(dataBase)
//   let collection = db.collection(collectionName)
//   collection.all().then(d => {
//     resolve(d)
//   }).catch(err => {
//     if (err.message.indexOf('collection not found') >= 0) {
//       collection.create().then(c => {
//         getAll(dataBase, collectionName).then(r => resolve(r)).catch(err => reject(err))
//       }).catch(err => reject(err))
//     } else if (err.message.indexOf('database not found') >= 0) {
//       db.useDatabase('_system')
//       db.createDatabase(dataBase).then(b => {
//         db.useDatabase(dataBase)
//         collection.create().then(c => {
//           getAll(dataBase, collectionName).then(r => resolve(r)).catch(err => reject(err))
//         }).catch(err => reject(err))
//       }).catch(err => {
//         reject(err)
//       })
//     } else {
//       reject(err)
//     }
//   })
// })

// const getByKey = (dataBase, collectionName, key) => new Promise((resolve, reject) => {
//   let obj = {
//     _key: key
//   }
//   find(dataBase, collectionName, obj).then(d => {
//     resolve(d._result[0])
//   }).catch(err => {
//     reject(err)
//   })
// })

// const query = (dataBase, query, bindVars) => new Promise((resolve, reject) => {
//   db.useDatabase(dataBase)
//   db.query({
//     query: query,
//     bindVars: bindVars
//   }).then(d => {
//     resolve(d)
//   }).catch(err => {
//     reject(err)
//   })
// })

// const find = (dataBase, collectionName, bindVars) => new Promise((resolve, reject) => {
//   db.useDatabase(dataBase)
//   let collection = db.collection(collectionName)
//   collection.byExample(bindVars).then(d => {
//     resolve(d)
//   }).catch(err => {
//     if (err.message.indexOf('collection not found') >= 0) {
//       collection.create().then(c => {
//         find(dataBase, collectionName, bindVars).then(r => resolve(r)).catch(err => reject(err))
//       }).catch(err => reject(err))
//     } else if (err.message.indexOf('database not found') >= 0) {
//       db.useDatabase('_system')
//       db.createDatabase(dataBase).then(b => {
//         db.useDatabase(dataBase)
//         collection.create().then(c => {
//           find(dataBase, collectionName, bindVars).then(r => resolve(r)).catch(err => reject(err))
//         }).catch(err => reject(err))
//       }).catch(err => {
//         reject(err)
//       })
//     } else {
//       reject(err)
//     }
//   })
// })

// const express = (req, res, next) => {
//   req.db = localModule
//   next()
// }
// let localModule = {
//   init,
//   express,
//   save,
//   find,
//   query,
//   getByKey,
//   getAll,
//   deleteP,
//   update,
//   db
// }

// module.exports = localModule
