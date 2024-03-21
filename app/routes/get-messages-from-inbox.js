const { client } = require('../node-postgres/database')

module.exports = {
  method: 'GET',
  path: '/inbox',
  handler: async (request, h) => {
    try {
      const fullInbox = 'select * from inbox'
      return (await client.query(fullInbox)).rows
    } catch (error) {
      return h.response('Internal Server Error').code(500)
    }
  }
}
