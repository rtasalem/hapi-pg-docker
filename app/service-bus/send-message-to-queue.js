const { delay, ServiceBusClient } = require('@azure/service-bus')
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
    const values = [message.body.content]
    await client.query(insertQuery, values)
    console.log(`New message saved to the database: ${message.body.content}`)
  } catch (error) {
    console.error(`ERROR SAVING MESSAGE TO DATABASE: ${error}`)
  } finally {
    await client.end()
  }
}

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING
const sbClient = new ServiceBusClient(connectionString)
const queue = process.env.SERVICE_BUS_QUEUE
const receiver = sbClient.createReceiver(queue)

const receiveFromQueue = async () => {
  try {
    const handleMessage = async (message) => {
      await saveMessageToDB(message)
      console.log(`Message received from queue: ${message.body.content}`)
    }

    const handleError = async (error) => {
      console.error(`Error occurred: ${error.message}`)
    }

    receiver.subscribe({
      processMessage: handleMessage,
      processError: handleError
    })

    await delay(10000)
  } catch (error) {
    console.error(`ERROR RECEIVING MESSAGE FROM QUEUE: ${error}`)
  } finally {
    await receiver.close()
    await sbClient.close()
  }
}

module.exports = {
  receiveFromQueue
}
