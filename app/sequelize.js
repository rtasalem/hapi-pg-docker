const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config()

// can't fully use dotenv with this setup?
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'pg_database',
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
  },
})

(async () => {
  try {
    await User.sync()
    const allUsers = await User.findAll()
    console.log(JSON.stringify(allUsers))
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  } finally {
    await sequelize.close()
  }
})()