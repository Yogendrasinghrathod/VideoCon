const serverStore = require("../serverStore");
const updateRooms = require("./updates/rooms");

const roomCreateHandler = (socket) => {
  console.log("Handle room create event");
  const socketId = socket.id;
  const userId = socket.user.userId;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId);

  // Check if roomDetails was created successfully
  if (roomDetails) {
    socket.emit('room-create', {
      roomDetails,
    });
    updateRooms();
  } else {
    // Handle room creation failure
    console.error("Failed to create room for user:", userId);
    socket.emit("error", { message: "Failed to create room. Please try again later." });
  }
};

const roomCreateWithTargetHandler = (socket, data) => {
  console.log("Handle room create with target event");
  const socketId = socket.id;
  const userId = socket.user.userId;
  const { targetUserId } = data;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId);

  if (roomDetails) {
    // Send room created to caller
    socket.emit('room-create', {
      roomDetails,
    });

    // Send incoming call notification to target user
    const io = serverStore.getSocketServerInstance();
    const targetConnections = serverStore.getActiveConnections(targetUserId);
    
    if (targetConnections && targetConnections.length > 0) {
      targetConnections.forEach(targetSocketId => {
        io.to(targetSocketId).emit('incoming-call', {
          callerId: userId,
          callerUsername: socket.user.username,
          roomId: roomDetails.roomId,
        });
      });
    }

    updateRooms();
  } else {
    console.error("Failed to create room for user:", userId);
    socket.emit("error", { message: "Failed to create room. Please try again later." });
  }
};

module.exports = roomCreateHandler;
module.exports.roomCreateWithTargetHandler = roomCreateWithTargetHandler;
