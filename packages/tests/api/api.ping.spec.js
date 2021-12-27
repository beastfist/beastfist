import got from 'got'
import test from 'ava'

const client = got.extend({
  prefixUrl: `${process.env.API_URL}/`,
  headers: {
    origin: `${process.env.API_URL}`
  }
})

test('ping test', async (t) => {
  console.log(process.env.API_URL)
  const response = await client.get('api/ping', {
    responseType: 'json'
  })
  t.true(!!response.body)
  t.true(!!response.body.result)
  t.true(response.body.result === 'pong')
  t.pass()
})

