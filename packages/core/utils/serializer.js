const fastJson = require('fast-json-stringify')
const { isHttpCode } = require('./http-utils')


module.exports = (schema) => {
  if (!schema || !schema.response) {
    return JSON.stringify
  }
  const keys = Object.keys(schema.response)
  const httpCodeKeys = Object.keys(schema.response).filter(isHttpCode)
  if (!keys.length !== httpCodeKeys.length) {
    return fastJson(schema.response)
  }
  const result = Object.assign({}, httpCodeKeys)
  httpCodeKeys.forEach(key => {
    result[key] = fastJson(schema.response[key])
  })
  return result
}
