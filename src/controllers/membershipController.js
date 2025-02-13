const { validationResult } = require('express-validator');
const Membership = require('../models/Membership');
const User = require('../models/User');
const UserMembership = require('../models/UserMembership');

exports.createMembership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;

    const membership = await Membership.create({
      name,
      description,
      price,
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll();

    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updateMembership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;

    const membership = await Membership.findByPk(req.params.id);
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    membership.name = name || membership.name;
    membership.description = description || membership.description;
    membership.price = price || membership.price;

    await membership.save();

    res.json({
      message: 'Membership updated successfully',
      membership: {
        id: membership.id,
        name: membership.name,
        description: membership.description,
        price: membership.price,
      }
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    await membership.destroy();

    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.assignMembership = async (req, res) => {
  try {
    const { 
      userId,
      membershipId, 
      startDate,
      endDate
    } = req.body;

    const membership = await Membership.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userMembership = await UserMembership.create({
      userId,
      membershipId,
      startDate,
      endDate
    });

    res.json({ 
      message: 'Membership assigned successfully',
      data: userMembership
    });
  } catch (error) {
    console.error('Error assigning membership:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updateMembershipAssignment = async (req, res) => {
  try {
    const { 
      userId,
      membershipId, 
      startDate,
      endDate
    } = req.body;

    const userMembership = await UserMembership.findByPk(req.params.id);
    
    if (!userMembership) {
      return res.status(404).json({ error: 'Membership assignment not found' });
    }

    userMembership.userId = userId || userMembership.userId;
    userMembership.membershipId = membershipId || userMembership.membershipId;
    userMembership.startDate = startDate || userMembership.startDate;
    userMembership.endDate = endDate || userMembership.endDate;

    await userMembership.save();

    res.json({ 
      message: 'Membership assignment updated successfully',
      data: userMembership
    });
  } catch (error) {
    console.error('Error updating membership assignment:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getMembershipByUserId = async (req, res) => {
  try {
    const userMemberships = await UserMembership.findAll({
      where: { userId: req.params.id },
      include: Membership
    });

    res.json(userMemberships);
  } catch (error) {
    console.error('Error fetching membership assignments:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.removeMembershipAssignment = async (req, res) => {
  try {
    const userMembership = await UserMembership.findByPk(req.params.id);
    if (!userMembership) {
      return res.status(404).json({ error: 'Membership assignment not found' });
    }

    await userMembership.destroy();

    res.json({ message: 'Membership assignment removed successfully' });
  } catch (error) {
    console.error('Error removing membership assignment:', error);
    res.status(500).json({ error: 'Server error' });
  }
}