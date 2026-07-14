const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    originalname:String,
    MimeType:String,
    size:Number,
    path:String,
    createdAt:Number,
    userId:String
});

module.exports = mongoose.model("fileSchema",fileSchema);