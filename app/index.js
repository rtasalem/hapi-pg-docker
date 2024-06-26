'use strict'
const Hapi = require('@hapi/hapi')
const { sequelize, User } = require('./sequelize/database')
const { client } = require('./node-postgres/database')
const { receiveFromQueue } = require('./service-bus/send-message-to-queue')
const { receiveFromTopic } = require('./service-bus/send-message-to-topic')

const init = async () => {
  try {
    await sequelize.authenticate()
    console.log('Successfully connected to the database')
    await sequelize.sync()
    await client.connect()

    const server = Hapi.server({
      port: 3001,
      host: '0.0.0.0'
    })

    server.route(require('./routes/home'))
    server.route(require('./routes/get-messages'))
    server.route(require('./routes/get-message-by-id'))
    server.route(require('./routes/get-users'))
    server.route(require('./routes/get-user-by-id'))
    server.route(require('./routes/get-messages-from-inbox'))
    server.route(require('./routes/get-message-by-id-from-inbox'))

    await server.start()
    await receiveFromQueue()
    await receiveFromTopic()
    console.log('Server running on %s', server.info.uri)
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
