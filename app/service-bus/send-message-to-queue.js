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
  const insertQuery = `insert into more_messages (body) values ($1)`
  await client.query(insertQuery, [message.body.body])
  await client.end()
  console.log(
    'A new message has been saved to the database: ',
    message.body.body
  )
}

const handleMessage = async (message) => {
  console.log('The following message has been recieved: ', message.body.body)
  await saveToDB(message)
}

const sendMessageToQueue = async () => {
  const sbClient = new ServiceBusClient(
    process.env.SERVICE_BUS_CONNECTION_STRING
  )
  const sender = sbClient.createSender(process.env.SERVICE_BUS_QUEUE_NAME)

  const sendMessage = async (messageBody) => {
    try {
      const message = {
        body: JSON.stringify(messageBody)
      }
      await handleMessage(message)
      await sender.sendMessages(message)
      console.log('Message sucessfully sent to service bus queue.')
    } catch (error) {
      console.log('Error sending message: ', error)
    }
  }
}

module.exports = { sendMessageToQueue }
