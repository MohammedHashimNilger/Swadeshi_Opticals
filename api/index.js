import "dotenv/config";
import serverless from "serverless-http";
import app from "../server/app.js";

// Wraps the exact same Express app in a serverless-compatible handler.
// This is the ONLY file that knows about Vercel — server/ stays
// deployment-agnostic.
export default serverless(app);
