const S = require('fluent-json-schema')

const cookies = S.object()
  .prop('Authorization', S.string())


module.exports = cookies
