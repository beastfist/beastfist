import Request from '../request/index.js'
import Response from '../response/index.js'

export default (route, handler) => {
  return (res, req, context) => {
    let response
    let request
    try {
      request = new Request({ route, req, res })
      response = new Response({ route, req, res, request })

      handler(response, request, context)
    } catch (e) {
      route.logger.error(e)
      if (response && !response._isDone) {
        response.writeStatus('503').end()
      }
    }
  }
}
