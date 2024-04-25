const jwt = require("jsonwebtoken");
const { fetchUserById } = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return res.status(400).json({
        message: "Token Not Provided",
        success: false,
      });
    }

    const token = bearerHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({
          message: "Invalid Token",
          success: false,
        });
      }

      const userId = decodedToken.id;
      const user = await fetchUserById(userId);

      if (!user) {
        return res.status(403).json({
          message: "Access Forbidden",
          success: false,
        });
      }

      req.user = userId;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = auth;
