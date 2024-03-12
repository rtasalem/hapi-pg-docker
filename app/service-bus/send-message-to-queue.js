const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

const saveToDB = async (message) => {
  const client = new Client({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: 5432
  })

  await client.connect()
  const insertQuery = `insert into messages (messages_id, content) values ($1, $2)`
  await client.query(insertQuery, [message.body.messages_id, message.body.content])
  await client.end()
  console.log('A new message has been saved to the database: ', message.body)
}

const handleMessage = async (message) => {
  console.log('The following message has been recieved: ', message.body)
  await saveToDB(message)
}

const startMessaging = async () => {
  const sbClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING)
  const receiver = sbClient.createReceiver(process.env.SERVICE_BUS_QUEUE_NAME)

  receiver.subscribe({
    processMessage: async (brokeredMessage) => {
      const message = {
        body: brokeredMessage.body
      }
      handleMessage(message)
    },
    processError: async (args) => {
      console.log('ERROR: ', args.error)
    }
  })
}

module.exports = { startMessaging }
