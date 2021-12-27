class PingController {
    ping (res, req) {
      res.send({ result: 'pong' })
    }
  
    pid (res, req) {
      res.end(`${process.pid}`)
    }
  }
  
  export default new PingController()
  