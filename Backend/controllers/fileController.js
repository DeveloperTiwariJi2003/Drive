const express = require("express");
const file = require('../models/file.js');
const fs = require("fs");
const path = require('path');
// const auth = require("./middlewares/auth");
// const upload = multer({ storage: storage });
async function insert(filename, originalname, MimeType, size, path,userId) {
  const data = new file({
    filename: filename,
    originalname: originalname,
    MimeType: MimeType,
    size: size,
    path: path,
    createdAt: new Date(),
    userId:userId
  })
  await data.save();
  console.log("data inserted");
}
// app.post('/api/upload',auth, upload.single('data'), (req, res) => {
  
// });
async function upload_single(req,res){
  await insert(req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, req.file.path,req.userId);
  res.json({
        success: true,
        message: "File uploaded successfully"
    });
}
async function upload_multiple(req,res){
  const allFiles = req.files;
  const filesData = allFiles.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    MimeType: file.mimetype,
    size: file.size,
    path: file.path,
    createdAt: new Date(),
    userId: req.userId
  }))
  await file.insertMany(filesData);
  // console.log("uploaded files");
  res.send("files Uploaded successfully")
}
async function get_files(req,res){
  const data = await file.find({userId:req.userId});
  // console.log(data);
  res.json(data);
}
async function delete_file(req,res){
  
    try {
      const id = req.params.id;
      // console.log(id);
      const foundFile = await file.findOne({ _id: id });
      // console.log(foundFile)
      if(foundFile.userId!==req.userId){ return res.status(404).send("Unauthorised user")}
      if (!foundFile) return res.status(404).send("File Not Found");
      // console.log("1")
      // console.log(foundFile.path);
      
      const filePathInSystem = path.join(__dirname,"..", foundFile.path);
      // console.log(filePathInSystem);
  
      await fs.promises.unlink(filePathInSystem);
      await file.findByIdAndDelete(id);
      res.send("Deleted successfully");
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Delete failed (disk or DB issue)");
    }
}

module.exports={upload_single,upload_multiple,get_files,delete_file};