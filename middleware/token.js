const jwt = require("jsonwebtoken");

const encode = async (payload) => {
  return  jwt.sign(payload, process.env.SECRET_KEY);
};

module.exports = {
  encode,
};
