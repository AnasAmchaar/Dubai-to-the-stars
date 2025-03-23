const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  seatClass: {
    type: String,
    enum: ['economy', 'luxury', 'vip'],
    required: true
  },
  accommodationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  totalPrice: {
    type: Number,
    required: true
  },
  travelTips: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;