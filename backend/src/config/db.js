const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to resolve MongoDB SRV records — fixes ECONNREFUSED on restrictive networks
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error(`\nTroubleshooting steps:`);
    console.error(`1. Go to MongoDB Atlas → Network Access → Allow Access from Anywhere (0.0.0.0/0)`);
    console.error(`2. Make sure your cluster is not paused`);
    console.error(`3. Check your internet connection`);
    process.exit(1);
  }
};

module.exports = connectDB;
