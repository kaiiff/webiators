const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webiators",
});

connection.connect((err) => {
  if (err) {
    console.log("not!", err);
  } else {
    console.log("connected to mysql server!");
  }
});

const utill = require("util");
function makeDb() {
  return {
    query(sql, args) {
      console.log("db connected localhost");
      console.log(sql);
      return utill.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      console.log("db not connected to localhost");
      return utill.promisify(connection.end).call(connection);
    },
  };
}
const db = makeDb();
module.exports = db;
