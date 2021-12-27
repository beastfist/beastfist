const S = require('fluent-json-schema')

const headers = S.object()
  .prop('lp-origin', S.string())
  .prop('lp-instance', S.string())


module.exports = headers
