const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;
    
    // Validate email format (this is an additional check, though you might already do it in Joi validation)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).send("Invalid email format.");
    }

    // Check if the user already exists
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user to the database
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h", // Token expiration time
      }
    );

    // Return the user details and token
    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
        _id: user._id,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Server error. Please try again later.");
  }
};

module.exports = postRegister;
