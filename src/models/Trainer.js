const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  hoursOfPractice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    defaultValue: 0
  }
});

// Set up the associations
Trainer.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Trainer, { foreignKey: 'userId' });

module.exports = Trainer;