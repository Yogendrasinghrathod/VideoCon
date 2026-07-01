const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { 
      type: String,
      required: true,
      maxlength: 1000, // Optional: limit content length
    },
    date: { 
      type: Date,
      default: Date.now, // Automatically set date to the current date
    },
    type: { 
      type: String,
      enum: ["TEXT", "IMAGE", "FILE", "DIRECT"], // Added "DIRECT" to the enum
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create indexes for efficient querying
messageSchema.index({ author: 1, date: -1 }); // Index by author and date (descending)

module.exports = mongoose.model("Message", messageSchema);
