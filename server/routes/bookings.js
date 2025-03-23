const express = require('express');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const Accommodation = require('../models/Accommodation');
const auth = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');
const router = express.Router();

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate travel tips
async function generateTravelTips(destination, departureDate) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate 5 travel tips for a space trip to ${destination} on ${departureDate}:`,
      max_tokens: 200,
      temperature: 0.7,
    });
    
    const text = response.data.choices[0].text.trim();
    return text.split('\n').filter(tip => tip.trim() !== '');
  } catch (error) {
    console.error('OpenAI error:', error);
    return [
      "Pack light for zero-gravity environments.",
      "Bring motion sickness medication for the adjustment period.",
      "Stay hydrated during your journey.",
      "Don't forget your camera for stunning space views.",
      "Follow all safety instructions from your flight crew."
    ];
  }
}

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { tripId, seatClass, accommodationId } = req.body;
    const userId = req.user.id;
    
    // Verify trip exists and has available seats
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.availableSeats[seatClass] <= 0) {
      return res.status(400).json({ message: 'No seats available in selected class' });
    }
    
    // Calculate total price
    let totalPrice = trip.prices[seatClass];
    
    // Add accommodation if selected
    if (accommodationId) {
      const accommodation = await Accommodation.findById(accommodationId);
      if (!accommodation) {
        return res.status(404).json({ message: 'Accommodation not found' });
      }
      totalPrice += accommodation.pricePerNight * trip.duration;
    }
    
    // Generate travel tips
    const travelTips = await generateTravelTips(trip.destination, trip.departureDate);
    
    // Create booking
    const booking = new Booking({
      userId,
      tripId,
      seatClass,
      accommodationId,
      totalPrice,
      travelTips,
      status: 'confirmed'
    });
    
    // Update available seats
    trip.availableSeats[seatClass] -= 1;
    await trip.save();
    
    await booking.save();
    
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('tripId')
      .populate('accommodationId');
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;