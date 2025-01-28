const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Booking = require('./Booking');
const UserMembership = require('./UserMembership');
const Course = require('./Course');
const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`;

class Payment extends Model {
  getPaymentable(options) {
    if (!this.paymentableType) return Promise.resolve(null);
    const mixinMethodName = `get${uppercaseFirst(this.paymentableType)}`;
    return this[mixinMethodName](options);
  }
}

Payment.init({
  paymentableId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentableType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Payment'
});

Booking.hasMany(Payment, { 
  foreignKey: 'paymentableId', 
  constraints: false, 
  scope: { 
    paymentableType: 'booking' 
  } 
});
Payment.belongsTo(Booking, {
  foreignKey: 'paymentableId',
  constraints: false,
  as: 'booking'
});

UserMembership.hasMany(Payment, { 
  foreignKey: 'paymentableId', 
  constraints: false, 
  scope: { 
    paymentableType: 'userMembership' 
  } 
});
Payment.belongsTo(UserMembership, {
  foreignKey: 'paymentableId',
  constraints: false,
  as: 'userMembership'
});

Course.hasMany(Payment, {
  foreignKey: 'paymentableId',
  constraints: false,
  scope: {
    paymentableType: 'course'
  }
});
Payment.belongsTo(Course, {
  foreignKey: 'paymentableId',
  constraints: false,
  as: 'course'
});

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Payment.addHook('afterFind', findResult => {
  if (!Array.isArray(findResult)) findResult = [findResult];
  for (const instance of findResult) {
    if (instance.paymentableType === 'booking' && instance.booking !== undefined) {
      instance.paymentable = instance.booking;
    } else if (instance.paymentableType === 'userMembership' && instance.userMembership !== undefined) {
      instance.paymentable = instance.userMembership;
    } else if (instance.paymentableType === 'course' && instance.course !== undefined) {
      instance.paymentable = instance.course;
    }

    delete instance.booking;
    delete instance.dataValues.booking;
    delete instance.userMembership;
    delete instance.dataValues.userMembership;
    delete instance.course;
    delete instance.dataValues.course;
  }
});

module.exports = Payment;