const jwt = require("jsonwebtoken");

const generateToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  };


module.exports = generateToken;
