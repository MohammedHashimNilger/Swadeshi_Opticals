/**
 * Centralized error handler — controllers can just `throw new Error(...)`
 * or call `next(err)` and this formats a consistent JSON response instead
 * of leaking stack traces to the client.
 */
export function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on our end.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}
