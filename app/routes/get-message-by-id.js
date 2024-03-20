const { client } = require('../node-postgres/database')

module.exports = {
  method: 'GET',
  path: '/messages/{id}',
  handler: async (request, h) => {
    try {
      const message = `select * from messages where messages_id = ${request.params.id}`
      const result = await client.query(message)

      if (result.rows.length === 0) {
        return h
          .response(
            `Message with ID ${request.params.id} not found in database.`
          )
          .code(404)
      }

      return result.rows
    } catch (error) {
      return h.response('Internal Server Error').code(500)
    }
  }
}
