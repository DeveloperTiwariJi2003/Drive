const cors = require("cors");
const express = require("express");
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is up at port ${PORT}`);
})