const User = require('../models/User');
const { validationResult } = require('express-validator');
const UserMembership = require('../models/UserMembership');
const Membership = require('../models/Membership');
const Course = require('../models/Course');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'phone'],
      include: [
        {
          model: UserMembership,
          attributes: ['id', 'userId', 'membershipId', 'startDate', 'endDate'],
          include: {
            model: Membership,
            attributes: ['name', 'description', 'price']
          }
        },
        {
          model: Course,
          attributes: ['id', 'userId', 'price', 'startDate', 'endDate']
        }
      ]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone'],
      include: [
        {
          model: UserMembership,
          attributes: ['id', 'userId', 'membershipId', 'startDate', 'endDate'],
          include: {
            model: Membership,
            attributes: ['name', 'description', 'price']
          }
        },
        {
          model: Course,
          attributes: ['id', 'userId', 'price', 'startDate', 'endDate']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.update({
      name: name || user.name,
      email: email || user.email,
      password: password || user.password,
      phone: phone || user.phone
    });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}