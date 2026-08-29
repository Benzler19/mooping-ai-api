const multer = require("multer");
const fs = require('fs');

// สร้างโฟลดเดอร์ ถ้าไม่มีโฟลเดอร์
const folderName = 'uploads';
fs.mkdir(folderName, { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Folder created successfully.');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = decodeURIComponent(file.originalname) //ถอดรหัส
    cb(null, uniqueSuffix);
  },
});
exports.upload = multer({ storage: storage }).single("file")
