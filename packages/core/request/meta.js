const define = (Request) => {
  Object.defineProperty(Request.prototype, 'logger', {
    get: function () {
      return this.route.logger
    }
  })
  Object.defineProperty(Request.prototype, '$', {
    get: function () {
      return this.route.app.$
    }
  })
  Object.defineProperty(Request.prototype, '_parsers', {
    get: function () {
      return this.route._parsers
    }
  })
  Object.defineProperty(Request.prototype, 'hostname', {
    get: function () {
      if (!this._hostname) {
        const host = this.getHeader('host')
        this._hostname = this.ips.length ? this.ips[0] : host
      }
      return this._hostname
    },
    set: function (val) {
      this._hostname = val
    }
  })
  Object.defineProperty(Request.prototype, 'url', {
    get: function () {
      return this._url
    },
    set: function (val) {
      this._url = val
    }
  })
  Object.defineProperty(Request.prototype, 'baseUrl', {
    get: function () {
      return this._baseUrl
    },
    set: function (val) {
      this._baseUrl = val
    }
  })
  Object.defineProperty(Request.prototype, 'path', {
    get: function () {
      return this._path
    },
    set: function (val) {
      this._path = val
    }
  })
  Object.defineProperty(Request.prototype, 'originalUrl', {
    get: function () {
      return this._originalUrl
    },
    set: function (val) {
      this._originalUrl = val
    }
  })
  Object.defineProperty(Request.prototype, 'socket', {
    get: function () {
      return this._socket
    },
    set: function (val) {
      this._socket = val
    }
  })
  Object.defineProperty(Request.prototype, 'context', {
    get: function () {
      return this._context
    },
    set: function (val) {
      this._context = val
    }
  })
  Object.defineProperty(Request.prototype, 'user', {
    get: function () {
      return this._user
    },
    set: function (val) {
      this._user = val
    }
  })
  Object.defineProperty(Request.prototype, 'session', {
    get: function () {
      return this._session
    },
    set: function (val) {
      this._session = val
    }
  })
  Object.defineProperty(Request.prototype, 'protocol', {
    get: function () {
      return this.route.protocol
    }
  })
  Object.defineProperty(Request.prototype, 'secure', {
    get: function () {
      return this.protocol === 'https'
    }
  })
  Object.defineProperty(Request.prototype, 'ip', {
    get: function () {
      if (!this._ip) {
        this._ip = Buffer.from(this.res.getRemoteAddressAsText()).toString()
      }
      return this._ip
    }
  })
  Object.defineProperty(Request.prototype, 'ips', {
    get: function () {
      if (!this._ips) {
        const forwaredFor = this.getHeader('X-Forwarded-For')
        let ips = []
        if (forwaredFor) {
          ips = forwaredFor.split(',').map(i => i.trim())
        }
        this._ips = ips
      }
      return this._ips
    }
  })
  Object.defineProperty(Request.prototype, 'method', {
    get: function () {
      return this.route.method
    }
  })
}

export default define
