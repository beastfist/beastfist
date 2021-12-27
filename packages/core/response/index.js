import base from './base.js'
import meta from './meta.js'
import headers from './headers.js'
import cookies from './cookies.js'
import pipe from './pipe.js'
import send from './send.js'
import sendFile from './sendFile.js'


/*
  Wrapper around uWebSockets.js HttpResponse
*/
const Response = function (args) {
  const self = this

  this.route = args.route
  this.req = args.req
  this.res = args.res
  this.request = args.request

  this._headers = new Map(this.route.defaults && this.route.defaults.response && this.route.defaults.response.headers ? this.route.defaults.response.headers : undefined)
  this._cookies = new Map(this.route.defaults && this.route.defaults.response && this.route.defaults.response.cookies ? this.route.defaults.response.cookies : undefined)

  // this._headers = new Map()
  // this._cookies = new Map()

  this._status = '200'
  this._statusRaw = 200
  this._isDone = false

  this._abortHandlers = new Set()

  if (this.route.isAsync) {
    this._abortHandlers.add(() => {
      self._isDone = true
    })
    self.res.onAborted(() => {
      self._isDone = true
      for (const handler in self._abortHandlers) {
        handler()
      }
    })
  }
}

base(Response)
meta(Response)
headers(Response)
cookies(Response)
pipe(Response)
send(Response)
sendFile(Response)

export default Response
