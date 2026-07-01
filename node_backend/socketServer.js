const authSocket = require("./middleware/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const { roomCreateWithTargetHandler } = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const roomLeaveHandler = require("./socketHandlers/roomLeaveHandler");
const roomInitializeConnectionHandler = require("./socketHandlers/roomInitializeConnectionHandler");
const roomSignalingDataHandler = require("./socketHandlers/roomSignalingDataHandler");

const serverStore = require("./serverStore");

const connectedUsers = new Map(); // Map to track connected users
const activeRooms = new Map(); // Map to store active rooms with their IDs

// Function to generate unique room ID
const generateUniqueRoomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomId = '';
  for (let i = 0; i < 6; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return roomId;
};

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  serverStore.setSocketServerInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("user connected");
    console.log(socket.id);

    // Add user tracking
    socket.on("user-connect", (userData) => {
      const { userId } = userData;
      
      // Check if user is already connected
      if (connectedUsers.has(userId)) {
        const existingSocket = connectedUsers.get(userId);
        if (existingSocket && existingSocket !== socket.id) {
          // Disconnect the previous connection
          io.to(existingSocket).emit("force-disconnect", {
            reason: "Another session has been started with your account"
          });
          io.sockets.sockets.get(existingSocket)?.disconnect();
        }
      }
      
      // Store the new connection
      connectedUsers.set(userId, socket.id);
      
      // Handle disconnection
      socket.on("disconnect", () => {
        if (connectedUsers.get(userId) === socket.id) {
          connectedUsers.delete(userId);
        }
        console.log("user disconnected");
      });
    });

    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on("room-create", (data = {}) => {
      const userId = data?.userId;
      
      if (!userId) {
        socket.emit("room-create-error", {
          error: "Invalid user data"
        });
        return;
      }

      const roomId = generateUniqueRoomId();
      
      // Store the room with its creator
      activeRooms.set(roomId, {
        creator: userId,
        participants: new Set([userId]),
        createdAt: Date.now()
      });

      // Notify the creator with the room ID
      socket.emit("room-created", { roomId });
    });

    socket.on("room-create-with-target", (data = {}) => {
      roomCreateWithTargetHandler(socket, data);
    });

    socket.on("room-join", (data = {}) => {
      const { roomId, userId } = data || {};
      
      if (!roomId || !userId) {
        socket.emit("room-join-error", { 
          error: "Invalid room or user data" 
        });
        return;
      }

      if (!activeRooms.has(roomId)) {
        socket.emit("room-join-error", { 
          error: "Room not found" 
        });
        return;
      }

      const room = activeRooms.get(roomId);
      
      // Check if user is already in the room
      if (room.participants.has(userId)) {
        socket.emit("room-join-error", { 
          error: "You are already in this room" 
        });
        return;
      }

      // Add user to room
      room.participants.add(userId);
      activeRooms.set(roomId, room);

      // Join the socket to the room
      socket.join(roomId);

      // Notify all participants
      io.to(roomId).emit("user-joined", { 
        userId,
        roomId
      });
    });

    socket.on("room-leave", (data = {}) => {
      const { roomId, userId } = data || {};
      
      // If no roomId or userId provided, just disconnect from all rooms
      if (!roomId || !userId) {
        socket.rooms.forEach(room => {
          if (room !== socket.id) { // Don't leave the default room
            socket.leave(room);
          }
        });
        return;
      }
      
      if (activeRooms.has(roomId)) {
        const room = activeRooms.get(roomId);
        room.participants.delete(userId);
        
        // Leave the socket room
        socket.leave(roomId);
        
        // If room is empty, delete it
        if (room.participants.size === 0) {
          activeRooms.delete(roomId);
        } else {
          activeRooms.set(roomId, room);
          // Notify remaining participants
          io.to(roomId).emit("user-left", { userId });
        }
      }
    });

    socket.on("conn-prepare", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 1000);
};

module.exports = {
  registerSocketServer,
};
