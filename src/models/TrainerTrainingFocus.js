const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Trainer = require('./Trainer');
const TrainingFocus = require('./TrainingFocus');

const TrainerTrainingFocus = sequelize.define('TrainerTrainingFocus', {
  trainer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Trainer,
      key: 'id'
    }
  },
  training_focus_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TrainingFocus,
      key: 'id'
    }
  }
}, { tableName: 'trainer_training_focus', timestamps: false });

Trainer.belongsToMany(TrainingFocus, { through: TrainerTrainingFocus, foreignKey: 'trainer_id' });
TrainingFocus.belongsToMany(Trainer, { through: TrainerTrainingFocus, foreignKey: 'training_focus_id' });

module.exports = TrainerTrainingFocus;