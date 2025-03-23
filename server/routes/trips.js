const express = require('express');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trip by ID
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search trips
router.post('/search', async (req, res) => {
  try {
    const { destination, departureDate, seatClass } = req.body;
    
    let query = {};
    
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    
    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      query.departureDate = { $gte: date, $lt: nextDay };
    }
    
    if (seatClass) {
      query[`availableSeats.${seatClass}`] = { $gt: 0 };
    }
    
    const trips = await Trip.find(query);
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;