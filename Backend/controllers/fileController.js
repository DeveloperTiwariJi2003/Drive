const express = require("express");
const file = require('../models/file.js');
const fs = require("fs");
const path = require('path');
const { imageSizeFromFile } = require("image-size/fromFile");
const { log } = require("console");
// const auth = require("./middlewares/auth");
// const upload = multer({ storage: storage });
async function insert(filename, originalname, MimeType, size, path, userId) {
  const data = new file({
    filename: filename,
    originalname: originalname,
    MimeType: MimeType,
    size: size,
    path: path,
    createdAt: new Date(),
    userId: userId
  })
  await data.save();
  console.log("data inserted");
}
// app.post('/api/upload',auth, upload.single('data'), (req, res) => {

// });
async function upload_single(req, res) {
  await insert(req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, req.file.path, req.userId);
  res.json({
    success: true,
    message: "File uploaded successfully"
  });
}



async function upload_multiple(req, res) {
  const allFiles = req.files;
  const filesData = [];

for (const file of allFiles) {

    let width = null;
    let height = null;

    if (file.mimetype.startsWith("image/")) {
        const dimensions = await imageSizeFromFile(file.path);
        console.log(dimensions);
        width = dimensions.width;
        height = dimensions.height;
    }

    filesData.push({
        filename: file.filename,
        originalname: file.originalname,
        MimeType: file.mimetype,
        size: file.size,
        path: file.path,
        width,
        height,
        createdAt: new Date(),
        userId: req.userId
    });
}
//   const filesData = allFiles.map(file => {

//   let width = null;
//   let height = null;

//   if (file.mimetype.startsWith("image/")) {

//     const dimensions = await imageSizeFromFile(file.path);
//     console.log(dimensions);
//     width = dimensions.width;
//     height = dimensions.height;
//   }

//   return {
//     filename: file.filename,
//     originalname: file.originalname,
//     MimeType: file.mimetype,
//     size: file.size,
//     path: file.path,

//     width,
//     height,

//     createdAt: new Date(),
//     userId: req.userId
//   };
// });
  await file.insertMany(filesData);
  // console.log("uploaded files");
  res.send("files Uploaded successfully")
}



async function get_files(req, res) {
  const data = await file.find({ userId: req.userId });
  // console.log(data);
  res.json(data);
}
async function delete_file(req, res) {

  try {
    const id = req.params.id;
    // console.log(id);
    const foundFile = await file.findOne({ _id: id });
    // console.log(foundFile)
    if (foundFile.userId !== req.userId) { return res.status(404).send("Unauthorised user") }
    if (!foundFile) return res.status(404).send("File Not Found");
    // console.log("1")
    // console.log(foundFile.path);

    const filePathInSystem = path.join(__dirname, "..", foundFile.path);
    // console.log(filePathInSystem);

    await fs.promises.unlink(filePathInSystem);
    await file.findByIdAndDelete(id);
    res.send("Deleted successfully");
  } catch (err) {
    console.log(err);

    res.status(500).send("Delete failed (disk or DB issue)");
  }
}
async function deleteselected(req, res) {
  const ids = req.body.ids;
  // console.log(ids);
  for (const id of ids) {
    try {
      const foundFile = await file.findOne({ _id: id });
      if (foundFile.userId !== req.userId) { return res.status(404).send("Unauthorised user") }
      if (!foundFile) return res.status(404).send("File Not Found");
      const filePathInSystem = path.join(__dirname, "..", foundFile.path);
      await fs.promises.unlink(filePathInSystem);
      await file.findByIdAndDelete(id);
      // console.log("deleted file");
      // res.send("Deleted successfully");
    } catch (err) {
      console.log(err);

      res.status(500).send("Delete failed (disk or DB issue)");
    }
    
  }
  return res.send("done");
}
module.exports = { upload_single, upload_multiple, get_files, delete_file, deleteselected };