const Conversation = require("../models/conversation");
const chatUpdates = require("./updates/chat");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;

    // Validate receiverUserId
    if (!receiverUserId) {
      socket.emit("error", { message: "Receiver user ID is required" });
      return;
    }

    // Find the conversation between the two users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
      type: "DIRECT",
    });

    if (conversation) {
      // Update the chat history for both users if the conversation exists
      console.log(`Conversation found for ${userId} and ${receiverUserId}. Sending chat history.`);
      chatUpdates.updateChatHistory(conversation._id.toString(), socket.id);
    } else {
      console.log(`No conversation found for ${userId} and ${receiverUserId}.`);
      socket.emit("error", { message: "No chat history found with this user" });
    }

  } catch (err) {
    console.error("Error in direct chat history handler:", err);
    socket.emit("error", { message: "An error occurred while retrieving chat history." });
  }
};

module.exports = directChatHistoryHandler;
