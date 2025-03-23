const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'default-accommodation.jpg'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;