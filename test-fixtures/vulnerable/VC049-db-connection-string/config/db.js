// MongoDB connection for the Express API (the usual MERN config/db.js).
// The Atlas connection string — username AND password — is pasted straight
// into the source, so anyone who can read the repo can log in to the cluster.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://shopadmin:Rk7vQ2pLx9Tz@cluster0.x7k2p.mongodb.net/shop?retryWrites=true&w=majority",
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
