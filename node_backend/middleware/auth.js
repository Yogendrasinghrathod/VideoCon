const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  // Look for the token in body, query params, or headers
  let token = req.body.token || req.query.token || req.headers["authorization"];

  // If no token is provided, respond with an error
  if (!token) {
    return res.status(403).json({ message: "Authorization token missing" });
  }

  try {
    // Remove 'Bearer ' prefix if present
    token = token.replace(/^Bearer\s+/, "");

    // Verify the token using the secret key
    const decoded = jwt.verify(token, config.TOKEN_KEY);

    // Attach decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    return next();
  } catch (err) {
    // Return a specific error message for different JWT verification failures
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
