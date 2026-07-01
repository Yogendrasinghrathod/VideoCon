const roomInitializeConnectionHandler = (socket, data) => {
  const { connUserSocketId } = data;

  // Ensure connUserSocketId is valid (non-null and non-undefined)
  if (connUserSocketId) {
    const initData = { connUserSocketId: socket.id };
    socket.to(connUserSocketId).emit("conn-init", initData);
  } else {
    console.warn("Invalid connUserSocketId:", connUserSocketId);
    // Optionally, emit an error back to the socket if needed
    socket.emit("error", { message: "Invalid connection user socket ID" });
  }
};

module.exports = roomInitializeConnectionHandler;
