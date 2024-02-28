const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'hapi-pg-docker-postgres',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'pg_database'
})

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = { sequelize, User }
