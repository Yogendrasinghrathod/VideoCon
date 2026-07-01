const Message = require("../models/message");
const Conversation = require("../models/conversation");
const chatUpdates = require("./updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    console.log("Handling direct message event");

    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    // Validate content and receiverUserId
    if (!receiverUserId || !content) {
      socket.emit("error", { message: "Invalid message data" });
      return;
    }

    // Create a new message
    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    // Find existing conversation between the users or create a new one
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      // Add the new message to the conversation
      conversation.messages.push(message._id);
      await conversation.save();
    } else {
      // Create a new conversation if it doesn't exist
      conversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });
    }

    // Perform chat history update for both sender and receiver (if they are online)
    chatUpdates.updateChatHistory(conversation._id.toString());

  } catch (err) {
    console.error("Error handling direct message:", err);
    // Optionally, emit an error back to the socket
    socket.emit("error", { message: "An error occurred while sending the message" });
  }
};

module.exports = directMessageHandler;
