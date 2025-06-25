// server.js - Main server file
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Import components
const { connectDatabase } = require("./config/database");
const socketHandler = require("./socket/socketHandler");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database connection
connectDatabase();

// Routes
app.use("/", routes);

// Socket.io connection handling
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
