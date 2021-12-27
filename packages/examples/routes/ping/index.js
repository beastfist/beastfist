const schema = require('./ping-schema')

module.exports = [
  {
    method: 'GET',
    url: '/api/ping',
    schema: schema.ping,
    handler: require('./ping-controller').ping
  },
  {
    method: 'GET',
    url: '/api/pid',
    // schema: schema.ping,
    handler: require('./ping-controller').pid
  }
]
