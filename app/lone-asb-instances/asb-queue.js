const { ServiceBusClient } = require('@azure/service-bus')
const messages = require('./example-messages')

const connectionString = 'get-primary-connection-string-from-env'
const queueName = 'get-queue-name-env'
const sbClient = new ServiceBusClient(connectionString)
const sender = sbClient.createSender(queueName)

async function sendMessage(message) {
  await sender.sendMessages(messages)
  console.log(`Message(s) succesfully sent to the queue: ${queueName}`)
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
