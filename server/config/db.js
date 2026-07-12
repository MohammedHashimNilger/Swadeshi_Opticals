import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using the connection string in .env.
 * We cache the connection promise so repeated calls (which happen
 * naturally in a serverless environment, where this file may be
 * re-invoked on every request) don't open a new connection each time.
 */
let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in your .env file");
  }

  cachedConnection = mongoose
    .connect(process.env.MONGODB_URI)
    .then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((err) => {
      cachedConnection = null; // allow retry on next request if it failed
      console.error("MongoDB connection error:", err.message);
      throw err;
    });

  return cachedConnection;
}
