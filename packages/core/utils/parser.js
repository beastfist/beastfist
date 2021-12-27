const compile = require('turbo-json-parse')

module.exports = (schema) => {
  const result = {
    query: null,
    params: null,
    headers: null,
    cookies: null,
    body: null
  }
  for (const parser in result) {
    result[parser] = !schema || !schema[parser] ? JSON.parse : compile(schema[parser])
  }
  return result
}
