const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const DataRecommendation = sequelize.define('DataRecommendation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

module.exports = DataRecommendation;