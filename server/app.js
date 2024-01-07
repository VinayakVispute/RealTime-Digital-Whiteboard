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

  socket.on("draw", (moves, options) => {
    console.log("drawing", moves, options);
    socket.broadcast.emit("socket_draw", moves, options);
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
