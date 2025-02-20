const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const UserMembership = require('../models/UserMembership');
const Course = require('../models/Course');
const User = require('../models/User');
const Membership = require('../models/Membership');

exports.createPaymentBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const booking = await Booking.findByPk(req.body.bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const payment = await booking.createPayment({
      title: 'Booking payment',
      amount: req.body.amount,
      paidAt: req.body.paidAt,
      userId: req.body.userId,
      paymentStatus: req.body.payment
    })

    res.status(201).json({
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPaymentUserMembership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userMembership = await UserMembership.findByPk(req.body.userMembershipId);
    if (!userMembership) {
      return res.status(404).json({ error: 'User membership not found' });
    }

    const payment = await userMembership.createPayment({
      title: 'Membership payment',
      amount: req.body.amount,
      paidAt: req.body.paidAt,
      userId: req.body.userId,
      paymentStatus: req.body.payment
    })

    res.status(201).json({
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPaymentCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = await Course.findByPk(req.body.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const payment = await course.createPayment({
      title: 'Course payment',
      amount: req.body.amount,
      paidAt: req.body.paidAt,
      userId: req.body.userId,
      paymentStatus: req.body.payment
    })

    res.status(201).json({
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getPaymentByUserId = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const payments = await Payment.findAll({
      where: { userId: req.params.id },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Booking,
          as: 'booking',
        },
        {
          model: UserMembership,
          as: 'userMembership',
          include: Membership
        },
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    const result = payments.map(payment => {
      const paymentable = payment.paymentable.toJSON();
      return {
        ...payment.toJSON(),
        paymentable,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getAllPayments = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Booking,
          as: 'booking',
        },
        {
          model: UserMembership,
          as: 'userMembership',
          include: Membership
        },
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    const result = payments.map(payment => {
      const paymentable = payment.paymentable.toJSON();
      return {
        ...payment.toJSON(),
        paymentable,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
}