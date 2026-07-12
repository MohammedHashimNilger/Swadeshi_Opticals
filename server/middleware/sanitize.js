function stripKeys(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(stripKeys);
    return obj;
  }
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        stripKeys(obj[key]);
      }
    }
  }
  return obj;
}

/**
 * Strips Mongo operator keys ($gt, $where, etc.) and dotted keys from
 * req.body only. Express 5 makes req.query/req.params getter-only, so
 * (unlike express-mongo-sanitize) this deliberately does NOT touch
 * those — body is where untrusted write payloads actually come from
 * in this app anyway (query params here are simple strings/filters).
 */
export function sanitizeBody(req, res, next) {
  if (req.body) stripKeys(req.body);
  next();
}
