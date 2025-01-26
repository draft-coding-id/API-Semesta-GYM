const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  week1Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  week1Done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  week2Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  week2Done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  week3Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  week3Done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  week4Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  week4Done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  acceptedTrainer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reasonRejection: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Set up associations
Booking.belongsTo(User, { as: 'member', foreignKey: 'memberId' });
Booking.belongsTo(User, { as: 'trainer', foreignKey: 'trainerId' });
User.hasMany(Booking, { as: 'memberBookings', foreignKey: 'memberId' });
User.hasMany(Booking, { as: 'trainerBookings', foreignKey: 'trainerId' });

module.exports = Booking;