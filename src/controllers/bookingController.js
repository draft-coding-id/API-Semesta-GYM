const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Trainer = require('../models/Trainer');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email', 'phone'],
          include: [
            {
              model: Trainer,
              attributes: ['description', 'hoursOfPractice', 'price', 'picture']
            }
          ]
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
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email', 'phone'],
          include: [
            {
              model: Trainer,
              attributes: ['description', 'hoursOfPractice', 'price', 'picture']
            }
          ]
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

exports.getBookingByIdMember = async (req, res) => {
  try {
    const booking = await Booking.findAll({
      where: { memberId: req.params.id },
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email', 'phone'],
          include: [
            {
              model: Trainer,
              attributes: ['description', 'hoursOfPractice', 'price', 'picture']
            }
          ]
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

exports.getBookingByIdTrainer = async (req, res) => {
  try {
    const booking = await Booking.findAll({
      where: { trainerId: req.params.id },
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email', 'phone'],
          include: [
            {
              model: Trainer,
              attributes: ['description', 'hoursOfPractice', 'price', 'picture']
            }
          ]
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
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email', 'phone']
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
      week4Done,
      acceptedTrainer,
      done,
      reasonRejection
    } = req.body;

    let endDate = null;
    if (acceptedTrainer === true) {
      // end date = now + 30 days
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
    }

    await booking.update({
      week1Date: week1Date || booking.week1Date,
      week1Done: week1Done !== undefined ? week1Done : booking.week1Done,
      week2Date: week2Date || booking.week2Date,
      week2Done: week2Done !== undefined ? week2Done : booking.week2Done,
      week3Date: week3Date || booking.week3Date,
      week3Done: week3Done !== undefined ? week3Done : booking.week3Done,
      week4Date: week4Date || booking.week4Date,
      week4Done: week4Done !== undefined ? week4Done : booking.week4Done,
      endDate,
      acceptedTrainer: acceptedTrainer !== undefined ? acceptedTrainer : booking.acceptedTrainer,
      done: done !== undefined ? done : booking.done,
      reasonRejection: reasonRejection || booking.reasonRejection
    });

    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email', 'phone']
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