require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    optionsSuccessStatus: 204,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./socket")(io);

app.use("/contacts", authMiddleware, contactRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected successfully");

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Closing server and database connection...");

  mongoose.connection.close((err) => {
    if (err) {
      console.error("Error closing MongoDB connection:", err);
    } else {
      console.log("MongoDB connection closed.");
    }
  });

  process.exit(0);
});
