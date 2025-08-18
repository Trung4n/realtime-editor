import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 24 * 1000, // 1 day
  max: 5, // 5 req/day
  message: {
    errors: [
      { msg: "Too many registration attempts, please try again later." },
    ],
  },
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 10 * 1000, // 10 minutes
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    errors: [{ msg: "Too many login attempts, please try again later." }],
  },
});
