const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  try {
    console.log("Login event received");

    const { mail, password } = req.body;

    // Look up user by email
    const user = await User.findOne({ mail: mail.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          mail: user.mail,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h", // Set expiration time to 24 hours
        }
      );

      // Return the user details and token
      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username,
          _id: user._id,
        },
      });
    }

    // Return invalid credentials message
    return res.status(400).send("Invalid credentials. Please try again.");
  } catch (err) {
    console.error("Login error: ", err);
    // Return a more specific error message for debugging
    return res.status(500).send("Server error, please try again later.");
  }
};

module.exports = postLogin;
