import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using the connection string in .env.
 * In serverless environments, we check mongoose's internal connection
 * state since module-level variables don't persist between invocations.
 *
 * We also cache the in-flight connection promise. Without this, several
 * requests arriving during a cold start would each see readyState !== 1
 * and independently call mongoose.connect(), racing each other. Callers
 * (see requireDB in server/app.js) now `await connectDB()` before
 * checking isDBConnected(), so this promise is what actually closes the
 * cold-start race.
 */
let connectionPromise = null;
let lastFailureAt = 0;

// After a failed attempt, don't immediately retry on the very next request -
// during a genuine outage that would mean every single request pays the
// full ~8-10s connection-attempt cost. Waiting this long between attempts
// keeps things responsive while still recovering automatically.
const RETRY_COOLDOWN_MS = 5000;

export async function connectDB() {
  // Check if mongoose is already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // A connection attempt is already in flight (e.g. from another
  // concurrent request during this cold start) — piggyback on it
  // instead of starting a second one.
  if (connectionPromise) {
    return connectionPromise;
  }

  if (Date.now() - lastFailureAt < RETRY_COOLDOWN_MS) {
    return null;
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in environment variables");
    return null;
  }

  connectionPromise = (async () => {
    try {
      // Create connection promise with timeout
      const connectionAttempt = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        maxPoolSize: 10,
      });

      // Add a 10-second timeout to prevent Vercel function timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timeout")), 10000)
      );

      const connection = await Promise.race([connectionAttempt, timeoutPromise]);
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    } catch (err) {
      console.error("MongoDB connection error:", err.message);
      // Let a later request retry (after the cooldown) instead of being
      // stuck forever for the lifetime of this warm container.
      lastFailureAt = Date.now();
      connectionPromise = null;
      return null;
    }
  })();

  return connectionPromise;
}

/**
 * Check if database connection is available
 */
export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
