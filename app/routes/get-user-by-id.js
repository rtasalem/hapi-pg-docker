const { sequelize, User } = require('../sequelize/database')

module.exports = {
  method: 'GET',
  path: '/users/{id}',
  handler: async (request, h) => {
    try {
      const user = await User.findByPk(userIdrequest.params.id)

      if (!user) {
        return h
          .response(`User with ID ${request.params.id} not found`)
          .code(404)
      }

      return user
    } catch (error) {
      console.error('Error fetching user: ', error)
      return h.response('Internal Server Error').code(500)
    }
  }
}
