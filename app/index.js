'use strict'

const Hapi = require('@hapi/hapi')
const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
});

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: '0.0.0.0'
  })

  server.route({
    method: '*',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!'
    }
  })
  
  server.route({
    method: 'GET',
    path: '/messages',
    handler: async (request, h) => {
      try {
        const getAllData = `select * from messages`
        const { rows } = await client.query(getAllData)
        return rows
      } catch (error) {
        return h.response('Internal server error').code(500)  
      }
    }
  })

  await client.connect()
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()