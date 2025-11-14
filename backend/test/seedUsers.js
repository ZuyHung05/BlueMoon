const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

// MongoDB connection

const seedUsers = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/react-auth';
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // Find roles
    const adminRole = await Role.findOne({ name: 'admin' });
    const userRole = await Role.findOne({ name: 'user' });

    if (!adminRole || !userRole) {
      console.log('⚠️ Roles not found. Please run seedRoles.js first.');
      process.exit(1);
    }

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    // Define sample users
    const users = [
      {
        email: 'admin@company.com',
        password: adminPassword,
        role: adminRole._id
      },
      {
        email: 'user1@company.com',
        password: userPassword,
        role: userRole._id
      },
      {
        email: 'user2@company.com',
        password: userPassword,
        role: userRole._id
      }
    ];

    // Clear old users and insert new ones
    await User.deleteMany({});
    await User.insertMany(users);

    console.log('✅ Users seeded successfully!');
    console.log('Admin login -> email: admin@company.com | password: Admin123!');
    console.log('User login  -> email: user1@company.com | password: User123!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    mongoose.connection.close();
  }
};

seedUsers();
