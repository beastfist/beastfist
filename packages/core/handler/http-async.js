const Request = require('../request')
const Response = require('../response')

module.exports = (route, handler) => {
  return async (res, req) => {
    let response
    let request

    try {
      request = new Request({ route, req, res })
      response = new Response({ route, req, res, request })

      for (const handle of handler) {
        await handle(response, request)
      }
    } catch (e) {
      route.logger.error(e)
      if (response && !response._isDone) {
        response.writeStatus('503').end()
      }
    }
  }
}
