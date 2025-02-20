const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Trainer = require('../models/Trainer');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { trainerId: req.params.trainerId },
    });

    if (!reviews) {
      return res.status(404).json({ error: 'Reviews not found' });
    }

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { memberId, trainerId, bookingId, rating, comment } = req.body;

    const review = await Review.create({
      memberId,
      trainerId,
      bookingId,
      rating,
      comment,
    });

    const trainerRating = await Review.findAll({
      where: { trainerId },
      attributes: ['rating'],
    });

    let totalRating = 0;
    trainerRating.forEach((rating) => {
      totalRating += rating.rating;
    });

    const avgRating = totalRating / trainerRating.length;

    const trainer = await Trainer.findByPk(trainerId);
    trainer.rating = avgRating;
    await trainer.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
}