const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // FIX: useNewUrlParser & useUnifiedTopology were REMOVED in Mongoose 8.
    // Passing them throws an error and silently breaks the connection.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
