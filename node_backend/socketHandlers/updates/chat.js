const Conversation = require("../../models/conversation");
const serverStore = require("../../serverStore");

const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
) => {
  try {
    // Find the conversation by ID and populate the necessary fields
    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages",
      model: "Message",
      populate: {
        path: "author",
        model: "User",
        select: "username _id",
      },
    });

    if (!conversation) {
      console.error("Conversation not found for ID:", conversationId);
      return;
    }

    const io = serverStore.getSocketServerInstance();

    if (toSpecifiedSocketId) {
      // Emit chat history to a specified socket
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }

    // Emit chat history to all active connections of participants
    conversation.participants.forEach((userId) => {
      const activeConnections = serverStore.getActiveConnections(
        userId.toString()
      );

      if (activeConnections.length > 0) {
        activeConnections.forEach((socketId) => {
          io.to(socketId).emit("direct-chat-history", {
            messages: conversation.messages,
            participants: conversation.participants,
          });
        });
      }
    });
  } catch (err) {
    console.error("Error updating chat history:", err);
  }
};

module.exports = { updateChatHistory };
