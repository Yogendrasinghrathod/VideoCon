const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandlers/updates/friends");
const updateRooms = require("./updates/rooms");

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  // Add new connected user
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  try {
    // Update pending friends invitations and friends list
    await friendsUpdate.updateFriendsPendingInvitations(userDetails.userId);
    await friendsUpdate.updateFriends(userDetails.userId);

    // After all updates, update rooms
    updateRooms(socket.id);
  } catch (error) {
    console.error("Error in processing user connection:", error);
    // Optionally emit an error to the client
    socket.emit("error", { message: "Something went wrong while connecting. Please try again." });
  }
};

module.exports = newConnectionHandler;
