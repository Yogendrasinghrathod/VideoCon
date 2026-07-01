const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const socketServer = require("./socketServer");
const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/video-conference-app";

const app = express();
app.use(express.json());
app.use(cors());

// Register the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

// Create the server
const server = http.createServer(app);

// Register the socket server
socketServer.registerSocketServer(server);

// Start the server immediately
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Connect to MongoDB (async, doesn't block server start)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  // Optionally, exit process after a delay to allow logging
  setTimeout(() => process.exit(1), 5000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Optionally, exit process after a delay to allow logging
  setTimeout(() => process.exit(1), 5000);
});
