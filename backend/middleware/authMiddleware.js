const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.tenant = await Tenant.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
