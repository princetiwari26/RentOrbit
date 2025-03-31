const jwt = require("jsonwebtoken");

const generateToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
  };

module.exports = generateToken;