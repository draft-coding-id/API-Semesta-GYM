const { validationResult } = require('express-validator');
const TrainingFocus = require('../models/TrainingFocus');

exports.getAllTrainingFocus = async (req, res) => {
  try {
    const trainingFoci = await TrainingFocus.findAll();
    res.json(trainingFoci);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTrainingFocusById = async (req, res) => {
  try {
    const trainingFocus = await TrainingFocus.findByPk(req.params.id);
    if (!trainingFocus) {
      return res.status(404).json({ error: 'Training focus not found' });
    }
    res.json(trainingFocus);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createTrainingFocus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const picture = req.file ? 'uploads/' + req.file.filename : null;

    const trainingFocus = await TrainingFocus.create({
      name,
      picture
    });

    res.status(201).json({
      message: 'Training focus created successfully',
      trainingFocus
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTrainingFocus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trainingFocus = await TrainingFocus.findByPk(req.params.id);
    if (!trainingFocus) {
      return res.status(404).json({ error: 'Training focus not found' });
    }

    const { name } = req.body;
    const picture = req.file ? req.file.filename : trainingFocus.picture;

    await trainingFocus.update({
      name,
      picture
    });

    res.json({
      message: 'Training focus updated successfully',
      trainingFocus
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTrainingFocus = async (req, res) => {
  try {
    const trainingFocus = await TrainingFocus.findByPk(req.params.id);
    if (!trainingFocus) {
      return res.status(404).json({ error: 'Training focus not found' });
    }

    await trainingFocus.destroy();
    res.json({ message: 'Training focus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};