const { validationResult } = require('express-validator');
const Course = require('../models/Course');
const DataCourse = require('../models/DataCourse');
const TrainingFocus = require('../models/TrainingFocus');

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

    res.json(course);
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.createDataCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trainingFocusId, name, description, numberOfPractices } = req.body;

    const dataCourse = await DataCourse.create({
      trainingFocusId,
      name,
      description,
      numberOfPractices,
      picture: req.file ? 'uploads/' + req.file.filename : null
    });

    res.status(201).json({
      message: 'Course created successfully',
      data: dataCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updateDataCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trainingFocusId, name, description, numberOfPractices } = req.body;

    const dataCourse = await DataCourse.findByPk(req.params.id);

    if (!dataCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    dataCourse.trainingFocusId = trainingFocusId || dataCourse.trainingFocusId;
    dataCourse.name = name || dataCourse.name;
    dataCourse.description = description || dataCourse.description;
    dataCourse.numberOfPractices = numberOfPractices || dataCourse.numberOfPractices;
    dataCourse.picture = req.file ? 'uploads/' + req.file.filename : dataCourse.picture;

    await dataCourse.save();

    res.json({
      message: 'Course updated successfully',
      data: dataCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.deleteDataCourse = async (req, res) => {
  try {
    const dataCourse = await DataCourse.findByPk(req.params.id);

    if (!dataCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await dataCourse.destroy();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getAllDataCourses = async (req, res) => {
  try {
    const dataCourses = await DataCourse.findAll({
      include: [
        {
          model: TrainingFocus,
          attributes: ['name']
        }
      ]
    });

    res.json(dataCourses);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getDataCourseById = async (req, res) => {
  try {
    const dataCourse = await DataCourse.findByPk(req.params.id, {
      include: [
        {
          model: TrainingFocus,
          attributes: ['name']
        }
      ]
    });

    if (!dataCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(dataCourse);
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getDataCourseByTrainingFocusId = async (req, res) => {
  try {
    const dataCourses = await DataCourse.findAll({
      where: {
        trainingFocusId: req.params.id
      },
      include: [
        {
          model: TrainingFocus,
          attributes: ['name']
        }
      ]
    });

    res.json( dataCourses );
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
}