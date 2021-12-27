import S from 'fluent-json-schema'

const pingResponse = S.object()
  .prop('result', S.string())

export default {
  ping: {
    response: pingResponse.valueOf()
  }
}
