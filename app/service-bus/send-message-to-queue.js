const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

const saveMessageToDB = async (message) => {
  const client = new Client({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: 5432
  })

  await client.connect()
  const insertQuery = `insert into inbox (content) values ('${message.body.content}')`
  await client.query(insertQuery)
  await client.end()
  console.log('New message saved to the database: ', message.body)
}

const handleMessage = async (message) => {
  console.log('The following message has been received: ', message.body)
  await saveMessageToDB(message)
}

const startMessaging = async () => {
  const sbClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING)
  const receiver = sbClient.createReceiver(process.env.SERVICE_BUS_QUEUE)

  receiver.subscribe({
    processMessage: async (brokeredMessage) => {
      const message = {
        body: brokeredMessage.body,
      }
      handleMessage(message)
    },
    processError: async (args) => {
      console.error('Error occurred: ', args.error)
    } 
  })
}

module.exports = {
  startMessaging
}