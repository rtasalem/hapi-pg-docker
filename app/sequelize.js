const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config()

// can't fully use dotenv with this setup?
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
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
    allowNull: false,
  }
})

try {
  console.log('Successfully connected to the database')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

// convert to try/catch
(async () => {
  await User.sync()
  await User.create({
    username: 'John Doe'
  })
  const allUsers = await User.findAll()
  console.log(allUsers)
  await sequelize.close()
})()