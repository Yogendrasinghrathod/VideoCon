const serverStore = require("../serverStore");
const roomLeaveHandler = require("./roomLeaveHandler");

const disconnectHandler = (socket) => {
  console.log(`User with socket ID ${socket.id} is disconnecting.`);

  const activeRooms = serverStore.getActiveRooms();

  activeRooms.forEach(activeRoom => {
    // Check if participants exist before proceeding
    if (activeRoom.participants && Array.isArray(activeRoom.participants)) {
      const isUserInRoom = activeRoom.participants.some(participant => participant.socketId === socket.id);
      
      if (isUserInRoom) {
        console.log(`User ${socket.id} found in room ${activeRoom.roomId}, leaving...`);
        roomLeaveHandler(socket, { roomId: activeRoom.roomId });
      }
    }
  });

  // Remove the user from the connected users list
  serverStore.removeConnectedUser(socket.id);

  console.log(`User with socket ID ${socket.id} successfully removed from connected users.`);
};

module.exports = disconnectHandler;
