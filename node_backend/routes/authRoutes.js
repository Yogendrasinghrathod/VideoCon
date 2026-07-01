const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");

// Validation schemas for registration and login
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

// Register route with validation and controller
router.post(
  "/register",
  validator.body(registerSchema),
  authControllers.controllers.postRegister
);

// Login route with validation and controller
router.post(
  "/login",
  validator.body(loginSchema),
  authControllers.controllers.postLogin
);

// Test route to verify if authentication middleware is working
router.get("/test", auth, (req, res) => {
  res.send("Request passed - Auth middleware working");
});

// Error handling for Joi validation failures
router.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // Handle Joi validation errors
    const errorDetails = err.error.details.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorDetails,
    });
  }
  next(err);
});

module.exports = router;
