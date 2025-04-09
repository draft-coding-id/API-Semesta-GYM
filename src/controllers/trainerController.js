const User = require('../models/User');
const Trainer = require('../models/Trainer');
const TrainingFocus = require('../models/TrainingFocus');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const TrainerTrainingFocus = require('../models/TrainerTrainingFocus');
const { use } = require('../routes/authRoutes');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.getTopTrainers = async (req, res) => {
  try {
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
      ],
      order: [[{ model: Review }, 'rating', 'DESC']],
      limit: 3
    });
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching top trainers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllTrainers = async (req, res) => {
  try {
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

    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id , {
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

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.registerTrainer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      name, 
      email, 
      password, 
      phone,
      trainingFocus, 
      description, 
      hoursOfPractice, 
      price 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user with trainer role
    const user = await User.create({
      name,
      email,
      password,
      role: 'trainer',
      phone
    });

    // Create trainer profile
    const trainer = await Trainer.create({
      userId: user.id,
      description,
      hoursOfPractice,
      price,
      picture: req.file ? 'uploads/' + req.file.filename : null
    });

    // Add training focus
    // await trainer.addTrainingFocus(trainingFocus);
    const trainingFocusIds = trainingFocus.map(id => ({ trainer_id: trainer.id, training_focus_id: id }));
    await TrainerTrainingFocus.bulkCreate(trainingFocusIds);

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Trainer registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        trainer: {
          id: trainer.id,
          trainingFocusId: trainer.trainingFocusId,
          description: trainer.description,
          hoursOfPractice: trainer.hoursOfPractice,
          price: trainer.price,
          picture: trainer.picture
        },
        trainingFocus: trainingFocusIds
      }
    });
  } catch (error) {
    if (trainer) {
      await trainer.destroy();
    }
    if (user) {
      await user.destroy();
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk( req.params.id );
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const { 
      name, 
      email, 
      password,
      phone, 
      trainingFocus, 
      description, 
      hoursOfPractice, 
      price 
    } = req.body;

    const user = await User.findByPk(trainer.userId);
    user.update({
      name: name || user.name, 
      email: email || user.email, 
      phone: phone || user.phone
    });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
    }

    await trainer.update({
      description : description || trainer.description,
      hoursOfPractice: hoursOfPractice || trainer.hoursOfPractice,
      price: price || trainer.price,
      picture: req.file ? 'uploads/' + req.file.filename : trainer.picture
    });

    // Remove existing training focus
    await TrainerTrainingFocus.destroy({ where: { trainer_id: trainer.id } });

    // Add new training focus
    const trainingFocusIds = trainingFocus.map(id => ({ trainer_id: trainer.id, training_focus_id: id }));
    await TrainerTrainingFocus.bulkCreate(trainingFocusIds);

    res.json({
      message: 'Trainer updated successfully',
      user,
      trainer
    });
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const user = await User.findByPk(trainer.userId);
    await trainer.destroy();
    await user.destroy();

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};