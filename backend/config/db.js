const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;


    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected successfully to: ${mongoURI}`);

  } catch (err) {
   
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;