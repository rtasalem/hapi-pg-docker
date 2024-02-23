'use strict'

const Hapi = require('@hapi/hapi')
const { client } = require('./database')

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: '0.0.0.0'
  })

  server.route({
    method: '*',
    path: '/',
    handler: async (request, h) => {
      return 'Hello World!'
    }
  })

  server.route({
    method: 'GET',
    path: '/messages',
    handler: async (request, h) => {
      try {
        await client.connect()
        // const getAllData = `select * from messages`
        // const { rows } = client.query(getAllData)
        // return 'connected!'
      } catch (error) {
        return console.log(error.message)
      }
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()