const express = require("express");
const {
  adduser,
  loginUser,
  get__user_info,
} = require("../controller/userController");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/register_user", adduser);
router.post("/login_user", loginUser);
router.get("/user_details", auth, get__user_info);

module.exports = router;
