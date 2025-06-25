// // config/database.js - Database configuration
// const mongoose = require("mongoose");

// const connectDatabase = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGODB_URI || "mongodb://localhost:27017/food_order_chatbot"
//     );
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = { connectDatabase };

// config/database.js
// config/database.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/food_order_chatbot"
    );
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
