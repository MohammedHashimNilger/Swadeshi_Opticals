import "dotenv/config";
import serverless from "serverless-http";
import app from "../server/app.js";

// Wraps the exact same Express app in a serverless-compatible handler.
// This is the ONLY file that knows about Vercel — server/ stays
// deployment-agnostic.
const expressHandler = serverless(app);

// Hard ceiling on how long any single invocation is allowed to take.
// This is a last-resort circuit breaker: if anything downstream hangs
// (a stuck MongoDB driver, a slow DNS lookup, whatever) the client still
// gets a response in ~8s instead of the request riding all the way out
// to Vercel's 300s function limit and coming back as a 504.
const WATCHDOG_MS = 8000;

export default async function handler(req, res) {
  let settled = false;

  const watchdog = setTimeout(() => {
    if (!settled && !res.headersSent) {
      settled = true;
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "The server took too long to respond. Please try again." }));
    }
  }, WATCHDOG_MS);
  // Don't let this timer itself keep the function alive if everything
  // else already finished cleanly.
  watchdog.unref?.();

  try {
    await expressHandler(req, res);
  } finally {
    settled = true;
    clearTimeout(watchdog);
  }
}
