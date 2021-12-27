import S from 'fluent-json-schema'

const cookies = S.object()
  .prop('Authorization', S.string())


export default cookies
