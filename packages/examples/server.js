const { join } = require('path')
require('dotenv').config({ path: join(__dirname, '.env') })

const run = async () => {
  const headers = require('@beastfist/core/defaults/res-headers')
  const App = require('@beastfist/core/app')
  const routes = require('./routes')
  const config = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4001
  }
  const app = new App(config)
  try {
    const defaults = {
      response: {
        headers
      }
    }
    for (const route of routes) {
      app.route(route, defaults)
    }
    await app.start()
  } catch (e) {
    app.logger.error(e)
  }
}
run()
