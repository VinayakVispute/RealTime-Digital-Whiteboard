import { createContext, useEffect, useRef, useState } from "react";

import { useMotionValue } from "framer-motion";
import { toast } from "react-toastify";

import { COLORS_ARRAY } from "@/common/constants/colors";
import { socket } from "@/common/lib/socket";
import { useSetUsers } from "@/common/recoil/room";
import { useSetRoom, useRoom } from "@/common/recoil/room/room.hooks";

export const roomContext = createContext(null);

const RoomContextProvider = ({ children }) => {
  const setRoom = useSetRoom();
  const { users } = useRoom();
  const { handleAddUser, handleRemoveUser } = useSetUsers();

  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const minimapRef = useRef(null);
  const selectionRefs = useRef([]);

  const [moveImage, setMoveImage] = useState({ base64: "" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    socket.on("room", (room, usersMovesToParse, usersToParse) => {
      const usersMoves = new Map(JSON.parse(usersMovesToParse));
      const usersParsed = new Map(JSON.parse(usersToParse));

      const newUsers = new Map();

      usersParsed.forEach((name, id) => {
        if (id === socket.id) return;

        const index = [...usersParsed.keys()].indexOf(id);

        const color = COLORS_ARRAY[index % COLORS_ARRAY.length];

        newUsers.set(id, {
          name,
          color,
        });
      });

      setRoom((prev) => ({
        ...prev,
        users: newUsers,
        usersMoves,
        movesWithoutUser: room.drawed,
      }));
    });

    socket.on("new_user", (userId, username) => {
      toast(`${username} has joined the room.`, {
        position: "top-center",
        theme: "colored",
      });

      handleAddUser(userId, username);
    });

    socket.on("user_disconnected", (userId) => {
      toast(`${users.get(userId)?.name || "Anonymous"} has left the room.`, {
        position: "top-center",
        theme: "colored",
      });

      handleRemoveUser(userId);
    });

    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnected");
    };
  }, [handleAddUser, handleRemoveUser, setRoom, users]);

  return (
    <roomContext.Provider
      value={{
        x,
        y,
        bgRef,
        undoRef,
        redoRef,
        canvasRef,
        setMoveImage,
        moveImage,
        minimapRef,
        selectionRefs,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomContextProvider;
