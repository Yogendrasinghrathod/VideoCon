const jwt = require("jsonwebtoken");
const User = require("../models/user");

const config = process.env;

const verifyTokenSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  // If no token is provided, return an error
  if (!token) {
    const socketError = new Error("Token is required");
    socketError.code = "TOKEN_REQUIRED";
    return next(socketError);
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    
    // Fetch user details from database to get username
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      const socketError = new Error("User not found");
      socketError.code = "USER_NOT_FOUND";
      return next(socketError);
    }
    
    // Attach user data to socket
    socket.user = {
      userId: decoded.userId,
      mail: decoded.mail,
      username: user.username
    };
  } catch (err) {
    // If token is invalid or expired, return a custom error
    const socketError = new Error("Invalid or expired token");
    socketError.code = "INVALID_TOKEN";
    return next(socketError);
  }

  next(); // Proceed to the next middleware or event handler
};

module.exports = verifyTokenSocket;
