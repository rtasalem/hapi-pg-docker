const { ServiceBusClient } = require('@azure/service-bus')
const messages = require('./example-messages')

const connectionString = 'insert-connection-string-here'
const queue = 'insert-queue-name-here'
const sbClient = new ServiceBusClient(connectionString)
const sender = sbClient.createSender(queue)

const sendMessage = async (message) => {
  await sender.sendMessages(messages)
  console.log(`Message(s) succesfully sent to Service Bus queue: ${queue}`)
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
