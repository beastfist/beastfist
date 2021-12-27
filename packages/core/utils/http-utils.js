const PARAMS_REGEX = /:([A-Za-z0-9_-]+)/g

export const methods = [
  'get',
  'post',
  'put',
  'patch',
  'del',
  'any',
  'head',
  'options',
  'trace'
]

export const getParamNames = (url) => {
    if (url.indexOf(':') !== -1) {
      const paramsArray = url.match(PARAMS_REGEX)
      if (paramsArray) {
        const params = new Map(paramsArray.map((name) => [name.substr(1), null]))
        return params
      }
    }
    return new Map()
  }

export const isHttpCode = (code) => {
  const codeInteger = +code
  if (
    typeof codeInteger === 'number' &&
    codeInteger > 100 &&
    codeInteger < 600
  ) {
    return 1
  }
  if (
    typeof code === 'string' &&
    code.length === 3 &&
    code.indexOf('X') !== -1
  ) {
    return 2
  }
  return 0
}

export const prepare =  (schema, params) => {
  const result = {
    query: null,
    headers: null,
    cookies: null,
    body: null
  }
  result.query = schema && schema.query && schema.query.properties
    ? Object.fromEntries(Object.keys(schema.query.properties).map(p => [p, null])) : null

  const schemaParams = schema && schema.params && schema.params.properties
    ? Object.keys(schema.params.properties) : []
  result.params = Object.fromEntries(schemaParams.length ? new Map([...params].filter(p => schemaParams.includes(p[0]))) : params)

  result.headers = schema && schema.headers && schema.headers.properties
    ? Object.fromEntries(Object.keys(schema.headers.properties).map(p => [p, null])) : null

  result.cookies = schema && schema.cookies && schema.cookies.properties
    ? Object.fromEntries(Object.keys(schema.cookies.properties).map(p => [p, null])) : null

  result.body = schema && schema.body && schema.body.properties
    ? Object.fromEntries(Object.keys(schema.body.properties).map(p => [p, null])) : null
  return result
}

export const areAsync = (handlers) => {
  return handlers && Array.isArray(handlers) && handlers.filter(h => h && h.constructor.name === 'AsyncFunction').length > 0
}
