const db = require("../utils/db");

module.exports = {
  register_user: async (user) => {
    console.log(user);
    return db.query(`insert into user set?`, [user]);
  },
  checkUserMail: async (email) => {
    return db.query(`select * from user where email ='${email}'`);
  },
  get_user: async (userId) => {
    return db.query(`select * from user where id=${userId}`);
  },

  fetchUserById: async (userId) => {
    return db.query(`select * from user where id=${userId}`);
  },

  getAllUser: async () => {
    return db.query(`select * from user order by id desc`);
  },
};
