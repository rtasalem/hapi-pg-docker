const { User} = require('../sequelize/database')

module.exports = {
  method: 'GET',
  path: '/users',
  handler: async (request, h) => {
    try {
      const allUsers = await User.findAll()
      return allUsers
    } catch (error) {
      return h.response('Internal Server Error').code(500)
    }
  }
}