const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TrainingFocus = require('./TrainingFocus');

const DataCourse = sequelize.define('DataCourse', {
  trainingFocusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TrainingFocus,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  numberOfPractices: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

DataCourse.belongsTo(TrainingFocus, { foreignKey: 'trainingFocusId' });
TrainingFocus.hasMany(DataCourse, { foreignKey: 'trainingFocusId' });

module.exports = DataCourse;