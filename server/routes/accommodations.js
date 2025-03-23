const express = require('express');
const Accommodation = require('../models/Accommodation');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all accommodations
router.get('/', async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.json(accommodations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get accommodation by ID
router.get('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Filter accommodations
router.post('/filter', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, amenities } = req.body;
    
    let query = {};
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.pricePerNight = {};
      if (minPrice !== undefined) query.pricePerNight.$gte = minPrice;
      if (maxPrice !== undefined) query.pricePerNight.$lte = maxPrice;
    }
    
    if (amenities && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }
    
    const accommodations = await Accommodation.find(query);
    res.json(accommodations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;