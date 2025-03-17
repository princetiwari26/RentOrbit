const express = require("express");
const { register, login } = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register/:type", (req, res) => {
  const type = req.params.type;
  if (!["tenant", "landlord"].includes(type)) {
    return res.status(400).json({ message: "Invalid user type" });
  }
  req.body.type = type;
  register(req, res);
});

router.post("/login", login);

module.exports = router;
