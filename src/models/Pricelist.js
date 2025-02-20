const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

const Pricelist = sequelize.define('Pricelist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = Pricelist;