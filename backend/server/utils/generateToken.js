import jwt from "jsonwebtoken";

/**
 * Signs a JWT for either a customer (User) or the Admin.
 * `role` gets embedded in the token so middleware can tell them apart
 * without a second DB lookup.
 */
export function generateToken({ id, role }) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
