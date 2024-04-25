const multer = require("multer");
const path = require("path");
const hash = require("random-hash");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/productImage/");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const filename = `${uniqueFilename}${fileExtension}`;
    cb(null, filename);
  },
});

// console.log("file data multer ===>>>", storage);

const upload = multer({ storage });

module.exports = upload;
