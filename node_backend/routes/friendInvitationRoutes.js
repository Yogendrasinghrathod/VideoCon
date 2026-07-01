const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const friendInvitationControllers = require("../controllers/friendInvitation/friendInvitationControllers");

const postFriendInvitationSchema = Joi.object({
  targetMailAddress: Joi.string().email().required().messages({
    "string.email": "Target email must be a valid email address.",
    "any.required": "Target email is required.",
  }),
});

const inviteDecisionSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Invitation ID is required.",
  }),
});

router.post(
  "/invite",
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.controllers.postInvite
);

router.post(
  "/accept",
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.controllers.postAccept
);

router.post(
  "/reject",
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.controllers.postReject
);

// Global error handling middleware
router.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // Joi validation error
    const errorDetails = err.error.details.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorDetails,
    });
  }

  // Handle unexpected errors
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

module.exports = router;
