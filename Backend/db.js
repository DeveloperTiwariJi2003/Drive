const mongoose = require("mongoose");
require("dotenv").config();
async function connectDB(){
   try {
        console.log("db connecting")
     await mongoose.connect(process.env.MONGO_URI);
     console.log("Connected to:", mongoose.connection.host);
console.log("Database:", mongoose.connection.name);
        console.log("DB connected")
   } catch (error) {
        console.log("error connecting DB",error);
   }
}
module.exports = connectDB;