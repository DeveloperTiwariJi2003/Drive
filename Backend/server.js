const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require('./db.js');
const path = require("path");
app.use(express.json());
require("dotenv").config();
connectDB();
const authRoutes = require("./routes/authRoutes.js");
app.use(authRoutes);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));
// console.log(path.join(__dirname, "uploads"));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/login.html'));
});
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(cors());
const fileRoutes = require("./routes/fileRoutes.js");
app.use(fileRoutes);
app.listen(5000, () => {
  console.log("server is up at port", 5000);
})