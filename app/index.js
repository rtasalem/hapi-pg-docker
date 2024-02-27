'use strict'

const Hapi = require('@hapi/hapi')
const { Sequelize, DataTypes } = require('sequelize')
const {Client} = require('pg')

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'hapi-pg-docker-postgres',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'pg_database',
})

const client = new Client({
  host: 'hapi-pg-docker-postgres',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
})

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  }
})

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: '0.0.0.0',
  })

  server.route({
    method: '*',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!'
    }
  })

  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      try {
        const allUsers = await User.findAll()
        return allUsers
      } catch (error) {
        console.error('Error fetching users:', error)
        return h.response('Internal Server Error').code(500)
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/messages',
    handler: async (request, h) => {
      try {
        const fetchAllData = `select * from messages`
        return client.query(fetchAllData) 
      } catch (error) {
        console.error('Error fetching messages:', error)  
      }
    }
  })

  try {
    await sequelize.authenticate()
    console.log('Successfully connected to the database')
    await sequelize.sync()
    await client.connect()
    await server.start()
    console.log('Server running on %s', server.info.uri)
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
