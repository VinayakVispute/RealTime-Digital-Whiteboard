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

const addMove = (roomId, socketId, move) => {
  const room = rooms.get(roomId);

  if (!room.users.has(socketId)) {
    room.users.set(socketId, [move]);
    console.log("Set new user");
  }
  room.users.get(socketId).push(move);
  console.log("addMove", room.users.get(socketId));
  console.log("addMove", rooms.get(roomId));
};

const undoMove = (roomId, socketId) => {
  const room = rooms.get(roomId);
  room.users.get(socketId).pop();
};

const leaveRoom = (roomId, socketId) => {
  const room = rooms.get(roomId);
  if (!room) return;
  const userMoves = room?.users?.get(socketId);
  room?.drawed?.push(...userMoves);
  room?.users?.delete(socketId);
  console.log("Confirm leave room", room);
};

io.on("connection", (socket) => {
  const getRoomId = () => {
    const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
    if (!joinedRoom) return socket.id;
    return joinedRoom;
  };

  console.log(`User with id ${socket.id} is connected to the server`);

  socket.on("create_room", () => {
    console.log("Received create_room event");

    let roomId = "";
    do {
      roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms.has(roomId));

    console.log("Generated roomId:", roomId);

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Create a new room object with users and drawed arrays
    rooms.set(roomId, { users: new Map(), drawed: [] });

    // Add the current socket to the users Map with an empty array
    rooms.get(roomId)?.users.set(socket.id, []);

    console.log(
      `Room ${roomId} created with initial state:`,
      rooms.get(roomId)
    );

    io.to(socket.id).emit("created", roomId);
    console.log(`Emitted "created" event to socket ${socket.id}`);
  });

  socket.on("join_room", (roomId) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      io.to(socket.id).emit("joined", roomId);
    } else {
      io.to(socket.id).emit("joined", "", true);
    }
  });

  socket.on("joined_room", () => {
    console.log("joined_room");
    const roomId = getRoomId();
    const room = rooms.get(roomId);
    if (room) {
      room.users.set(socket.id, []);
      io.to(socket.id).emit("room", room, JSON.stringify([...room.users]));
      socket.broadcast.to(roomId).emit("new_user", socket.id);
    }
  });

  socket.on("leave_room", () => {
    const roomId = getRoomId();
    leaveRoom(roomId, socket.id);
    io.to(roomId).emit("user_disconnected", socket.id);
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
    leaveRoom(roomId, socket.id);
    io.to(roomId).emit("user_disconnected", socket.id);

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
