const { ServiceBusClient } = require('@azure/service-bus')
const messages = require('./example-messages')

const connectionString =
  'insert-connection-string-here'
const topic = 'insert-topic-name-here'
const sbClient = new ServiceBusClient(connectionString)
const sender = sbClient.createSender(topic)

const sendMessage = async (message) => {
  await sender.sendMessages(messages)
  console.log(`Message(s) successfully sent to Service Bus topic: ${topic}`)
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
