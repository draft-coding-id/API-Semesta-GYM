const { validationResult } = require('express-validator');
const DataRecommendation = require('../models/DataRecommendation');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const TrainingFocus = require('../models/TrainingFocus');
const Review = require('../models/Review');

exports.createDataRecommendation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, data } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingDataRecommendation = await DataRecommendation.findOne({
      where: { userId }
    });

    if (existingDataRecommendation) {
      return res.status(400).json({ error: 'Data recommendation already exists' });
    }

    const dataRecommendation = await DataRecommendation.create({
      userId,
      data
    });

    res.status(201).json(dataRecommendation);
  } catch (error) {
    console.error('Error creating data recommendation:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getDataRecommendationByUserId = async (req, res) => {
  try {
    const dataRecommendation = await DataRecommendation.findOne({
      where: { userId: req.params.userId }
    });

    if (!dataRecommendation) {
      return res.status(404).json({ error: 'Data recommendation not found' });
    }

    const trainers = await Trainer.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: TrainingFocus,
          attributes: ['id', 'name', 'picture']
        },
        {
          model: Review,
          attributes: ['rating', 'comment'],
          include: [{
            model: User,
            attributes: ['name']
          }]
        }
      ]
    });

    // Filter trainers based on data recommendation
    const filteredTrainers = trainers.filter(trainer => 
      trainer.TrainingFocus.some(focus => 
        dataRecommendation.data.includes(focus.name)
      )
    );

    // Sort trainers based on rating
    const sortedTrainers = filteredTrainers.sort((trainerA, trainerB) => parseFloat(trainerB.rating) - parseFloat(trainerA.rating));

    res.json({
      dataRecommendation: dataRecommendation.data,
      trainers: sortedTrainers
    });
  }
  catch (error) {
    console.error('Error fetching data recommendation:', error);
    res.status(500).json({ error: 'Server error' });
  }
}