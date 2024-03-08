const { ServiceBusClient } = require('@azure/service-bus')
const messages = require('./example-messages')

const connectionString = 'insert-primary-connection-string-here'
const queueName = 'insert-queue-name-here'
const sbClient = new ServiceBusClient(connectionString)
const sender = sbClient.createSender(queueName)

async function sendMessage(message) {
  await sender.sendMessages(messages)
  console.log(`Sent ${messages.length} messages to the queue: ${queueName}`)
}

sendMessage()
  .then(() => {
    return sender.close()
  })
  .then(() => {
    return sbClient.close()
  })
  .catch((err) => {
    console.error(err)
  })
