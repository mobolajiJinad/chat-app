require("express-async-errors");
require("dotenv").config();

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const path = require("path");
const {
  authRoutes,
  chatRoutes,
  defRoutes,
  chatListRoutes,
} = require("./routes/routes");
const { authMiddleware, guestMiddleware } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require("./socket")(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Seven days
    },
  })
);

app.use(flash());

app.use("/", defRoutes);
app.use("/chat-list", authMiddleware, chatListRoutes);
app.use("/auth", guestMiddleware, authRoutes);
app.use("/chat", authMiddleware, chatRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully");

    // Start listening on the port after the database connection is established
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
