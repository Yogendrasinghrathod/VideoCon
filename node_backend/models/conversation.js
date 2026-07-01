const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    type: {
      type: String,
      enum: ["DIRECT", "GROUP"], // "DIRECT" for one-on-one, "GROUP" for group chats
      required: true,
    },
    name: {
      type: String, // Optional field for group name (only relevant for group chats)
      maxlength: 100,
      required: function () {
        return this.type === "GROUP";
      },
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message", // Reference to the last message in the conversation
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Ensure a conversation is unique for a pair of users (for direct conversations)
conversationSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);
