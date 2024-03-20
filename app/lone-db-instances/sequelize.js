const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'get-username-from-env',
  password: 'get-pass-from-env',
  database: 'get-db-from-env'
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

(async () => {
  try {
    await User.sync()
    const allUsers = await User.findAll()
    console.log(JSON.stringify(allUsers))
  } catch (error) {
    console.log(error)
  } finally {
    await sequelize.close()
  }
})()