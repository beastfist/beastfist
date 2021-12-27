const Request = require('../request')
const Response = require('../response')

module.exports = (route, handler) => {
  return async (res, req, context) => {
    let response
    let request

    try {
      request = new Request({ route, req, res })
      response = new Response({ route, req, res, request })

      await handler(response, request, context)
    } catch (e) {
      route.logger.error(e)
      if (response && !response._isDone) {
        response.writeStatus('503').end()
      }
    }
  }
}
