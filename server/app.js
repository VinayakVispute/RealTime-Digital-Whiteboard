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
    room.usersMoves.set(socketId, [move]);
    console.log("Set new user");
  }
  room.usersMoves.get(socketId).push(move);
};

const undoMove = (roomId, socketId) => {
  const room = rooms.get(roomId);
  room.usersMoves.get(socketId).pop();
};

io.on("connection", (socket) => {
  const getRoomId = () => {
    const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
    if (!joinedRoom) return socket.id;
    return joinedRoom;
  };

  console.log(`User with id ${socket.id} is connected to the server`);

  const leaveRoom = (roomId, socketId) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const userMoves = room?.usersMoves?.get(socketId);
    room?.users?.delete(socketId);

    socket.leave(roomId);
  };

  socket.on("create_room", (username) => {
    console.log("Received create_room event");

    let roomId = "";
    do {
      roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms.has(roomId));

    console.log("Generated roomId:", roomId);

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Create a new room object with users and drawed arrays
    rooms.set(roomId, {
      usersMoves: new Map([[socket.id, []]]),
      users: new Map([[socket.id, username]]),
      drawed: [],
    });

    console.log(
      `Room ${roomId} created with initial state:`,
      rooms.get(roomId)
    );

    io.to(socket.id).emit("created", roomId);
    console.log(`Emitted "created" event to socket ${socket.id}`);
  });

  socket.on("join_room", (roomId, username) => {
    const room = rooms.get(roomId);
    if (room) {
      socket.join(roomId);
      room.users.set(socket.id, username);
      room.usersMoves.set(socket.id, []);
      io.to(socket.id).emit("joined", roomId);
    } else {
      io.to(socket.id).emit("joined", "", true);
    }
  });

  socket.on("check_room", (roomId) => {
    if (rooms.has(roomId)) socket.emit("room_exists", true);
    else socket.emit("room_exists", false);
  });

  socket.on("joined_room", () => {
    console.log("joined_room");
    const roomId = getRoomId();
    const room = rooms.get(roomId);
    if (!room) return;
    const usersMovesToParse = JSON.stringify([...room.usersMoves]);
    const usersToParse = JSON.stringify([...room.users]);
    console.log(usersMovesToParse, usersToParse);
    io.to(socket.id).emit("room", room, usersMovesToParse, usersToParse);
    socket.broadcast
      .to(roomId)
      .emit("new_user", socket.id, room.users.get(socket.id) || "Anonymous");
  });

  socket.on("leave_room", () => {
    const roomId = getRoomId();
    leaveRoom(roomId, socket.id);
    io.to(roomId).emit("user_disconnected", socket.id);
  });

  socket.on("draw", (move) => {
    const roomId = getRoomId();
    const timestamp = Date.now();
    move.id = uuidv4();
    addMove(roomId, socket.id, { ...move, timestamp });

    io.to(socket.id).emit("your_move", { ...move, timestamp });
    socket.broadcast
      .to(roomId)
      .emit("user_draw", { ...move, timestamp }, socket.id);
  });

  socket.on("send_msg", (msg) => {
    io.to(getRoomId()).emit("new_msg", socket.id, msg);
  });

  socket.on("mouse_move", (x, y) => {
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
