import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters long"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscore")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
