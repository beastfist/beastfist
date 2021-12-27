import fastJson from 'fast-json-stringify'
import { isHttpCode } from './http-utils.js'


export default (schema) => {
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
