const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.log("Connection to MongoDB failed :", err.message);
  }
};

module.exports = connectDB
