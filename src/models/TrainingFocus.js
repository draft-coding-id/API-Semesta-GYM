const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingFocus = sequelize.define('TrainingFocus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { tableName: 'training_focus'});

module.exports = TrainingFocus;