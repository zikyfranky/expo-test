const { log } = require("console");
const { existsSync, mkdirSync } = require("fs");
const multer = require("multer");
const path = require("path");

const dpStorage = multer.diskStorage({
  // Directory where the uploaded files will be stored
  destination: (_, __, cb) => {
    let dir = path.join(__dirname, "images");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    let newName = Date.now() + "-" + (file.originalname || ".jpg");
    cb(null, newName); // File name for the uploaded image
  },
});

const dpUpload = multer({ storage: dpStorage });

module.exports = dpUpload;
