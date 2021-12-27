import * as fastJson from 'fast-json-stringify'
import * as compile from 'turbo-json-parse'
import compress from './utils/compressor.js'
import { getParamNames, prepare, areAsync } from './utils/http-utils.js'
import serializer from './utils/serializer.js'
import parser from './utils/parser.js'
import httpAsync from './handler/http-async.js'
import httpSync from './handler/http-sync.js'
import wsUpgradeAsync from './handler/ws-upgrade-async.js'
import wsUpgradeSync from './handler/ws-upgrade-sync.js'


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
      return httpAsync(this, this.handler)
    } else {
      return httpSync(this, this.handler)
    }
  }

  /**
   * WS handler
   * @returns wrapper handler
   */
  wsHandler () {
    if (this.isAsync) {
      this.upgrade = wsUpgradeAsync(this, this.upgrade)
    } else {
      this.upgrade = wsUpgradeSync(this, this.upgrade)
    }

    return this
  }
}

export default Route
