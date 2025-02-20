const { validationResult } = require('express-validator');
const Pricelist = require('../models/Pricelist');

exports.getPricelist = async (req, res) => {
  try {
    const pricelist = await Pricelist.findAll();

    res.json(pricelist);
  } catch (error) {
    console.error('Error fetching pricelist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPricelistByName = async (req, res) => {
  try {
    const pricelist = await Pricelist.findOne({
      where: { name: req.params.name },
    });

    if (!pricelist) {
      return res.status(200).json({ 
        name: req.params.name,
        price: 0
       });
    }

    res.json(pricelist);
  } catch (error) {
    console.error('Error fetching pricelist:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.createPricelist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price } = req.body;

    const pricelist = await Pricelist.create({
      name,
      price,
    });

    res.status(201).json(pricelist);
  } catch (error) {
    console.error('Error creating pricelist:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updatePricelist = async (req, res) => {
  try {
    const pricelist = await Pricelist.findOne({
      where: { name: req.params.name },
    });

    if (!pricelist) {
      return res.status(404).json({ error: 'Pricelist not found' });
    }

    const { name, price } = req.body;

    await pricelist.update({
      name: name || pricelist.name,
      price: price || pricelist.price,
    });

    res.json(pricelist);
  } catch (error) {
    console.error('Error updating pricelist:', error);
    res.status(500).json({ error: 'Server error' });
  }
}