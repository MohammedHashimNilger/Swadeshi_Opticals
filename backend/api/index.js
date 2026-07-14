import "dotenv/config";
import app from "../server/app.js";

// Vercel's Node.js runtime calls this export as a plain (req, res) handler.
// Express apps are already valid (req, res) functions, so we export the
// app directly here — no Lambda-style adapter (serverless-http) needed.
// This is the ONLY file that knows about Vercel — server/ stays
// deployment-agnostic.
export default app;
