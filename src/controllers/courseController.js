const { validationResult } = require('express-validator');
const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, price, startDate, endDate } = req.body;

    const course = await Course.create({
      userId,
      price,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updateCourseByUserId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { price, startDate, endDate } = req.body;

    const course = await Course.findOne({
      where: {
        userId: req.params.userId
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.price = price || course.price;
    course.startDate = startDate || course.startDate;
    course.endDate = endDate || course.endDate;

    await course.save();

    res.json({
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.destroy();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getCourseByUserId = async (req, res) => {
  try {
    const course = await Course.findOne({
      where: {
        userId: req.params.userId
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ data: course });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}