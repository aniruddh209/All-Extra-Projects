import mongoose from 'mongoose';
import env from './env.js';

/**
 * Connect to MongoDB.
 * Uses Mongoose with the connection string from environment variables.
 * Logs connection status and exits the process if connection fails at startup.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`  Database: Connected → ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`  Database: Connection failed → ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
