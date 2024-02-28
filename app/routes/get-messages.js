const { client } = require('../node-postgres/database')

module.exports = {
  method: 'GET',
  path: '/messages',
  handler: async (request, h) => {
    try {
      const allMessages = 'select * from messages'
      return (await client.query(allMessages)).rows
    } catch (error) {
      return h.response('Internal Server Error').code(500)
    }
  }
}