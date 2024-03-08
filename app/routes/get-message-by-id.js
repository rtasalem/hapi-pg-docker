const { client } = require('../node-postgres/database')

module.exports = {
  method: 'GET',
  path: '/messages/{id}',
  handler: async (request, h) => {
    try {
      const selectMessageById = `select * from messages where messages_id = ${request.params.id}`
      return (await client.query(selectMessageById)).rows
    } catch (error) {
      console.error('Error retrieving message:', error)
      return h.response('Internal Server Error').code(500)
    }
  }
}
