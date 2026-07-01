const { v4: uuidv4 } = require("uuid");

const connectedUsers = new Map();
let activeRooms = [];

let io = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
  }
};

const getActiveConnections = (userId) => {
  const activeConnections = [];

  connectedUsers.forEach(function (value, key) {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  return onlineUsers;
};

// Rooms

const addNewActiveRoom = (userId, socketId) => {
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
    roomId: uuidv4(),
  };
  activeRooms = [...activeRooms, newActiveRoom]; // Corrected array mutation
  return newActiveRoom;
};

const getActiveRooms = () => {
  return [...activeRooms]; // Return a copy to avoid external mutation
};

const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find((activeRoom) => activeRoom.roomId === roomId);
  return activeRoom ? { ...activeRoom } : null;
};

const joinActiveRoom = (roomId, newParticipation) => {
  const room = activeRooms.find((room) => room.roomId === roomId);
  if (room) {
    activeRooms = activeRooms.filter((room) => room.roomId !== roomId); // Remove old room
    const updatedRoom = {
      ...room,
      participants: [...room.participants, newParticipation],
    };
    activeRooms.push(updatedRoom); // Add updated room
  }
};

const leaveActiveRoom = (roomId, participantsSocketId) => {
  const activeRoom = activeRooms.find((room) => room.roomId === roomId);
  if (activeRoom) {
    const updatedRoom = { ...activeRoom };
    updatedRoom.participants = updatedRoom.participants.filter(
      (participant) => participant.socketId !== participantsSocketId
    );

    activeRooms = activeRooms.filter((room) => room.roomId !== roomId);
    if (updatedRoom.participants.length > 0) {
      activeRooms.push(updatedRoom);
    }
  }
};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  setSocketServerInstance,
  getSocketServerInstance,
  getOnlineUsers,
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
};
