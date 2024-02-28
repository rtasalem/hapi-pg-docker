const { DataTypes } = require('sequelize')
const { sequelize } = require('../sequelize/database')

// can't seem to import into index.js
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

module.exports = User 
