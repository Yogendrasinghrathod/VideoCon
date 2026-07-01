const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendInvitationSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING", // Default status is "PENDING"
    },
    message: {
      type: String,
      maxlength: 500, // Optional message field for the invitation
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Ensure no duplicate invitations between the same sender and receiver
friendInvitationSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model("FriendInvitation", friendInvitationSchema);
