import schema from './ping-schema.js'
import controller from './ping-controller.js' 


export default [
  {
    method: 'GET',
    url: '/api/ping',
    schema: schema.ping,
    handler: controller.ping
  },
  {
    method: 'GET',
    url: '/api/pid',
    // schema: schema.ping,
    handler: controller.pid
  }
]
