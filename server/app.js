const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); // Fix import statement
const port = process.env.PORT || 8000;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// to test the server is working
app.get("/", async (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log(`User with id ${socket.id} is connected to the server`);

  socket.join("global");
  const allUsers = io.sockets.adapter.rooms.get("global");

  if (allUsers) {
    io.to("global").emit("users_in_room", [...allUsers]);
  }

  socket.on("draw", (moves, options) => {
    socket.broadcast.emit("user_draw", moves, options, socket.id);
  });

  socket.on("mouse_moved", (x, y) => {
    socket.broadcast.emit("mouse_moved", x, y, socket.id);
    console.log("mouse_moved");
  });

  socket.on("undo", () => {
    console.log("undo");
    socket.broadcast.emit("user_undo", socket.id);
  });

  socket.on("disconnect", () => {
    console.log(`User with id ${socket.id} disconnected`);
  });
});

const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
