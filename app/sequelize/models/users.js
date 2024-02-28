const { DataTypes } = require('sequelize')
const { sequelize } = require('../sequelize/database')

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

module.exports = { User }
