import path, { join } from 'path'
import * as dotenv from 'dotenv'
import headers from '@beastfist/core/defaults/res-headers.js'
import App from '@beastfist/core/app.js'
import routes from './routes/index.js'

dotenv.config({ path: join(path.resolve(), '.env') })

const run = async () => {
  
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
    console.log(e)
    app.logger.error(e)
  }
}
run()
