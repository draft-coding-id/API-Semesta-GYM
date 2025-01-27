const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Trainer = require('./Trainer');
const Booking = require('./Booking');
const User = require('./User');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trainer,
      key: 'id'
    }
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Set up the associations
Review.belongsTo(User, { foreignKey: 'memberId' });
User.hasOne(Review, { foreignKey: 'memberId' })

Review.belongsTo(Trainer, { foreignKey: 'trainerId' });
Trainer.hasMany(Review, { foreignKey: 'trainerId' });

Review.belongsTo(Booking, { foreignKey: 'bookingId' });
Booking.hasOne(Review, { foreignKey: 'bookingId' });

module.exports = Review;