const mongoose = require('mongoose');
const Role = require('../models/Role');

const MONGO_URI = 'mongodb://localhost:27017/react-auth';

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const roles = [
      { name: 'admin', permissions: ['manage_users', 'edit_content', 'view_dashboard'] },
      { name: 'engineer', permissions: ['view_dashboard', 'deploy'] },
      { name: 'user', permissions: ['view_dashboard'] }
    ];

    await Role.deleteMany({});
    await Role.insertMany(roles);

    console.log('✅ Roles seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding roles:', err);
    mongoose.connection.close();
  }
};

seedRoles();
