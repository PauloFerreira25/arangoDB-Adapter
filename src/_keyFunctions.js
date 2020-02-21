const functions = {
  uuid: doc => {
    const uuidv4 = require('uuid/v4')
    doc._key = uuidv4()
    return doc
  }
}

module.exports = functionType => {
  const defaultFunction = doc => doc

  if (typeof functionType === 'undefined') {
    // ação default
    return defaultFunction
  }

  if (typeof functionType === 'function') {
    return functionType
  }

  return functions[functionType] || defaultFunction
}
