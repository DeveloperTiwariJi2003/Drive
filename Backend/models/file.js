const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    originalname:String,
    MimeType:String,
    size:Number,
    path:String,
    createdAt:Number,
    userId:String,
    width:Number,
    height:Number
});

module.exports = mongoose.model("fileSchema",fileSchema);