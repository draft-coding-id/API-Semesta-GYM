const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      memberId,
      trainerId,
      week1Date,
      week2Date,
      week3Date,
      week4Date
    } = req.body;

    const booking = await Booking.create({
      memberId,
      trainerId,
      week1Date,
      week2Date,
      week3Date,
      week4Date
    });

    const bookingWithRelations = await Booking.findByPk(booking.id, {
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: bookingWithRelations
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const {
      week1Date,
      week1Done,
      week2Date,
      week2Done,
      week3Date,
      week3Done,
      week4Date,
      week4Done
    } = req.body;

    await booking.update({
      week1Date: week1Date || booking.week1Date,
      week1Done: week1Done !== undefined ? week1Done : booking.week1Done,
      week2Date: week2Date || booking.week2Date,
      week2Done: week2Done !== undefined ? week2Done : booking.week2Done,
      week3Date: week3Date || booking.week3Date,
      week3Done: week3Done !== undefined ? week3Done : booking.week3Done,
      week4Date: week4Date || booking.week4Date,
      week4Done: week4Done !== undefined ? week4Done : booking.week4Done
    });

    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};