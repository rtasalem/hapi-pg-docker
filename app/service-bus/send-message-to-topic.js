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

  try {
    await client.connect()
    const insertQuery = `insert into inbox (content) values ($1)`
    await client.query(insertQuery, [message.body.content])
    console.log('New message saved to the database: ', message.body)
  } catch (error) {
    console.error('ERROR SAVING MESSAGE TO DATABASE: ', error)
  } finally {
    await client.end()
  }
}

const handleMessage = async (message) => {
  try {
    await saveMessageToDB(message)
    console.log('Message received: ', message.body)
  } catch (error) {
    console.error('ERROR HANDLING MESSAGE: ', error)
  }
}

const startMessaging = async () => {
  try {
    const sbClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING)
    const topic = sbClient.createSender(process.env.SERVICE_BUS_TOPIC)
    const subscription = topic.createReceiver(process.env.SERVICE_BUS_SUBSCRIPTION)
    const receiver = subscription.createReceiver()

    receiver.subscribe({
      processMessage: async (brokeredMessage) => {
        const message = {
          body: brokeredMessage.body
        }
        handleMessage(message)
      },
      processError: async (args) => {
        console.error('Error occurred: ', args.error)
      }
    })
  } catch (error) {
    console.error('ERROR ON STARTING MESSAGING: ', error)
  }
}

module.exports = {
  startMessaging
}
