const express = require("express");
const multer = require('multer');
const fs = require("fs");
const storage = multer.diskStorage({
  destination:function (req, file, cb) {
      
      const uploadPath = `uploads/${req.userId}`;
      fs.mkdirSync(uploadPath,{recursive:true});
      cb(null,uploadPath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

module.exports =upload;