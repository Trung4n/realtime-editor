import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
/**
 * Signs a JWT token with the provided payload and expiration time.
 * @param {Object} payload - The payload to sign.
 * @param {string} [expiresIn='7d'] - The expiration time for the token.
 * @returns {string} The signed JWT token.
 */

export function signToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} The decoded payload if valid, or null if invalid.
 */

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
