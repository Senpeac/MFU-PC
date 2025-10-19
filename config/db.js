const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB using the URI supplied via environment variables.
 * This helper is imported by the main application during startup.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
