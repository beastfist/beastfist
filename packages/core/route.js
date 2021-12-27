const fastJson = require('fast-json-stringify')
const compile = require('turbo-json-parse')
const compress = require('./utils/compressor')
const { getParamNames, prepare, areAsync } = require('./utils/http-utils')

const serializer = require('./utils/serializer')
const parser = require('./utils/parser')


class Route {
  constructor (options, defaults) {
    this.defaults = defaults
    this.compress = compress
    this.fastJson = fastJson
    this.compile = compile

    this.app = options.app
    this.method = options.route.method
    this.url = options.route.url
    this.auth = options.route.auth

    // handlers
    this.handler = Array.isArray(options.route.handler)
      ? [...this.app.handlers, ...options.route.handler]
      : [...this.app.handlers, options.route.handler]

    this.upgrade = options.route.upgrade
    this.open = options.route.open
    this.message = options.route.message
    this.drain = options.route.drain
    this.close = options.route.close
    this.ping = options.route.ping
    this.pong = options.route.pong

    this.compression = options.route.compression
    this.idleTimeout = options.route.idleTimeout
    this.maxPayloadLength = options.route.maxPayloadLength


    this.schema = options.route.schema
    this.isAsync = (areAsync(this.handler)) || (this.upgrade && this.upgrade.constructor.name === 'AsyncFunction')
    this.logger = options.logger

    this.params = getParamNames(this.url)
    const prep = prepare(this.schema, this.params)
    this._query = prep.query
    this._params = prep.params
    this._headers = prep.headers
    this._cookies = prep.cookies
    this._body = prep.body

    this._serializers = serializer(this.schema)
    this._parsers = parser(this.schema)
  }

  /**
   * HTTP (GET/PUT/POST/DELETE/OPTIONS) handler
   * @returns the wrapper handler
   */
  httpHandler () {
    if (this.isAsync) {
      return require('./handler/http-async')(this, this.handler)
    } else {
      return require('./handler/http-sync')(this, this.handler)
    }
  }

  /**
   * WS handler
   * @returns wrapper handler
   */
  wsHandler () {
    if (this.isAsync) {
      this.upgrade = require('./handler/ws-upgrade-async')(this, this.upgrade)
    } else {
      this.upgrade = require('./handler/ws-upgrade-sync')(this, this.upgrade)
    }

    return this
  }
}

module.exports = Route
