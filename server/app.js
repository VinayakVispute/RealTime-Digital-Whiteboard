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

const rooms = new Map();
rooms.set("global", new Map());

const addMove = (roomId, socketId, move) => {
  const room = rooms.get(roomId);

  if (!room?.has(socketId)) {
    room?.set(socketId, [move]);
  }
  room?.get(socketId)?.push(move);
  console.log(rooms.get("global"));
};

const undoMove = (roomId, socketId) => {
  const room = rooms.get(roomId);

  if (room?.has(socketId)) {
    room.get(socketId).pop();
  }
};

io.on("connection", (socket) => {
  const getRoomId = () => {
    const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
    if (!joinedRoom) return socket.id;
    return joinedRoom;
  };

  console.log(`User with id ${socket.id} is connected to the server`);

  socket.on("create_room", () => {
    let roomId = "";
    do {
      roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms.has(roomId));
    socket.join(roomId);
    rooms.set(roomId, new Map());
    console.log("room created", roomId);
    rooms.get(roomId)?.set(socket.id, []);
    console.log("Create", [...rooms.get(roomId)]);

    io.to(socket.id).emit("created", roomId);
  });
  socket.on("join_room", (roomId) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      console.log("room joined", roomId);
      io.to(socket.id).emit("joined", roomId);
    } else {
      io.to(socket.id).emit("joined", "", true);
    }
  });

  socket.on("joined_room", () => {
    console.log("joined_room");
    const roomId = getRoomId();
    rooms.get(roomId)?.set(socket.id, []);
    console.log("roomId", [...rooms.get(roomId)]);
    io.to(socket.id).emit("room", JSON.stringify([...rooms.get(roomId)]));
    socket.broadcast.to(roomId).emit("new_user", socket.id);
  });

  socket.on("leave_room", () => {
    const roomId = getRoomId();
    const user = rooms.get(roomId)?.get(socket.id);
    console.log("user", user);
    if (user?.length === 0) rooms.get(roomId)?.delete(socket.id);
  });

  socket.on("draw", (move) => {
    const roomId = getRoomId();
    addMove(roomId, socket.id, move);
    socket.broadcast.to(roomId).emit("user_draw", move, socket.id);
  });

  socket.on("mouse_moved", (x, y) => {
    const roomId = getRoomId();
    socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
  });

  socket.on("undo", () => {
    const roomId = getRoomId();
    undoMove(roomId, socket.id);
    socket.broadcast.to(roomId).emit("user_undo", socket.id);
  });

  socket.on("disconnecting", () => {
    const roomId = getRoomId();
    io.to(roomId).emit("user_disconnected", socket.id);
    const user = rooms.get(roomId)?.get(socket.id);
    if (user?.length === 0) rooms.get(roomId)?.delete(socket.id);
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
