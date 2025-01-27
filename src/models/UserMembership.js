const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Membership = require('./Membership');

const UserMembership = sequelize.define('UserMembership', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  membershipId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Membership,
      key: 'id'
    }
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

UserMembership.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserMembership, { foreignKey: 'userId' });

UserMembership.belongsTo(Membership, { foreignKey: 'membershipId' });
Membership.hasMany(UserMembership, { foreignKey: 'membershipId' });

module.exports = UserMembership;