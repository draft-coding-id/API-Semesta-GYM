const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Course = sequelize.define('Course', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

Course.belongsTo(User, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
User.hasMany(Course, { foreignKey: 'userId' });

module.exports = Course;