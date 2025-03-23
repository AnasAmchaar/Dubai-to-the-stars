const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  availableSeats: {
    economy: { type: Number, default: 100 },
    luxury: { type: Number, default: 50 },
    vip: { type: Number, default: 10 }
  },
  prices: {
    economy: { type: Number, required: true },
    luxury: { type: Number, required: true },
    vip: { type: Number, required: true }
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in days
    required: true
  },
  imageUrl: {
    type: String,
    default: 'default-trip.jpg'
  }
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;