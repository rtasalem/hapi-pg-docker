const { client } = require('../node-postgres/database')

module.exports = {
  method: 'GET',
  path: '/inbox/{id}',
  handler: async (request, h) => {
    try {
      const inbox = `select * from inbox where id = ${request.params.id}`
      const result = await client.query(inbox)

      if (result.rows.length === 0) {
        return h
          .response(
            `There is no message in the inbox with an ID of ${request.params.id}.`
          )
          .code(404)
      }

      return result.rows
    } catch (error) {
      return h.response('Internal Server Error').code(500)
    }
  }
}
