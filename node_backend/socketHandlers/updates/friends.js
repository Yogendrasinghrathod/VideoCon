const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const serverStore = require("../../serverStore");

const updateFriendsPendingInvitations = async (userId) => {
  try {
    // Fetch pending friend invitations for the user
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username mail");

    // Find all active connections for the user
    const receiverList = serverStore.getActiveConnections(userId);

    if (!receiverList || receiverList.length === 0) {
      console.log(`No active connections for user ${userId}`);
      return;
    }

    const io = serverStore.getSocketServerInstance();

    // Emit pending invitations to each active connection
    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations || [],
      });
    });
  } catch (err) {
    console.error("Error updating pending invitations:", err);
    // Optionally, emit an error to the client
    // socket.emit("error", { message: "Failed to update pending invitations." });
  }
};

const updateFriends = async (userId) => {
  try {
    // Find active connections for the user
    const receiverList = serverStore.getActiveConnections(userId);

    if (!receiverList || receiverList.length === 0) {
      console.log(`No active connections for user ${userId}`);
      return;
    }

    // Fetch user with their friends list
    const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
      "friends",
      "_id username mail"
    );

    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    const friendsList = user.friends.map((f) => ({
      id: f._id,
      mail: f.mail,
      username: f.username,
    }));

    const io = serverStore.getSocketServerInstance();

    // Emit the friends list to each active connection
    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-list", {
        friends: friendsList || [],
      });
    });
  } catch (err) {
    console.error("Error updating friends list:", err);
    // Optionally, emit an error to the client
    // socket.emit("error", { message: "Failed to update friends list." });
  }
};

module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
};
