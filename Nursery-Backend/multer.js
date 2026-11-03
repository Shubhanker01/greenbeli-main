const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/Uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "");
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});



const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    const filetypes = /avif|jpeg|jpg|png|gif|mp4/;

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb("invalid file type", false);
    }
  },
});

module.exports = upload;