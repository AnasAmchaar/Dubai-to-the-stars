const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const Accommodation = require('./models/Accommodation');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Trip.deleteMany({});
    await Accommodation.deleteMany({});
    
    // Seed trips
    const trips = [
      {
        destination: 'International Space Station',
        departureDate: new Date('2024-07-15'),
        availableSeats: { economy: 50, luxury: 20, vip: 5 },
        prices: { economy: 50000, luxury: 150000, vip: 250000 },
        description: 'Experience life in Earth\'s orbit aboard the ISS, the largest human-made structure in space.',
        duration: 7,
        imageUrl: 'iss.jpg'
      },
      {
        destination: 'Lunar Base Alpha',
        departureDate: new Date('2024-09-20'),
        availableSeats: { economy: 30, luxury: 15, vip: 5 },
        prices: { economy: 120000, luxury: 300000, vip: 500000 },
        description: 'Visit humanity\'s first permanent lunar outpost and experience 1/6th Earth gravity.',
        duration: 14,
        imageUrl: 'lunar-base.jpg'
      },
      {
        destination: 'Mars Colony',
        departureDate: new Date('2024-11-30'),
        availableSeats: { economy: 20, luxury: 10, vip: 3 },
        prices: { economy: 500000, luxury: 1000000, vip: 2000000 },
        description: 'Be among the first tourists to visit the red planet and its pioneering human settlement.',
        duration: 60,
        imageUrl: 'mars-colony.jpg'
      },
      {
        destination: 'Orbital Hotel',
        departureDate: new Date('2024-08-05'),
        availableSeats: { economy: 100, luxury: 50, vip: 20 },
        prices: { economy: 30000, luxury: 80000, vip: 150000 },
        description: 'Enjoy luxury accommodations with Earth views from this five-star orbital resort.',
        duration: 5,
        imageUrl: 'orbital-hotel.jpg'
      },
      {
        destination: 'Saturn Ring Observatory',
        departureDate: new Date('2025-02-15'),
        availableSeats: { economy: 15, luxury: 8, vip: 2 },
        prices: { economy: 800000, luxury: 1500000, vip: 3000000 },
        description: 'Marvel at the beauty of Saturn\'s rings from our observatory at the edge of the solar system.',
        duration: 90,
        imageUrl: 'saturn-observatory.jpg'
      }
    ];
    
    await Trip.insertMany(trips);
    console.log('Trips seeded successfully');
    
    // Seed accommodations
    const accommodations = [
      {
        name: 'Lunar Hotel',
        location: 'Lunar Base Alpha',
        pricePerNight: 15000,
        amenities: ['Low-gravity spa', 'Crater view rooms', 'Oxygen bar', 'Moon dust souvenirs'],
        description: 'Experience luxury on the lunar surface with Earth views and low-gravity amenities.',
        imageUrl: 'lunar-hotel.jpg',
        rating: 4.8
      },
      {
        name: 'Orbital Suite',
        location: 'Earth Orbit',
        pricePerNight: 8000,
        amenities: ['Zero-gravity pool', 'Panoramic Earth view', 'Space walk experience', 'Gourmet freeze-dried cuisine'],
        description: 'Luxury accommodations in Earth orbit with breathtaking views of our home planet.',
        imageUrl: 'orbital-suite.jpg',
        rating: 4.5
      },
      {
        name: 'Mars Habitat',
        location: 'Mars Colony',
        pricePerNight: 25000,
        amenities: ['Martian dust protection', 'Radiation shielding', 'Terraformed gardens', 'Martian rover excursions'],
        description: 'Stay comfortably on the red planet with all necessary amenities and exclusive excursions.',
        imageUrl: 'mars-habitat.jpg',
        rating: 4.2
      },
      {
        name: 'Space Station Capsule',
        location: 'International Space Station',
        pricePerNight: 5000,
        amenities: ['Authentic astronaut experience', 'Research lab tours', 'Space food tastings'],
        description: 'The budget-friendly authentic astronaut experience aboard the historic space station.',
        imageUrl: 'station-capsule.jpg',
        rating: 4.0
      },
      {
        name: 'Galactic Penthouse',
        location: 'Orbital Hotel',
        pricePerNight: 50000,
        amenities: ['Private zero-gravity chamber', 'Personal butler', '360-degree observation dome', 'Space champagne'],
        description: 'The ultimate luxury in space, with personalized service and exclusive amenities.',
        imageUrl: 'galactic-penthouse.jpg',
        rating: 5.0
      }
    ];
    
    await Accommodation.insertMany(accommodations);
    console.log('Accommodations seeded successfully');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.disconnect();
  }
};

seedDatabase();