import { useMotionValue } from "framer-motion";
import {
  createContext,
  Dispatch,
  ReactChild,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "react-toastify";

import { COLORS_ARRAY } from "../../../common/constants/color";

import { socket } from "../../../common/lib/socket";
import { useSetUsers } from "../../../common/recoil/room";
import { useRoom, useSetRoom } from "../../../common/recoil/room/RoomHooks";
export const roomContext = createContext(null);

export const useRoomContext = () => {
  const context = useContext(roomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

export const RoomProvider = (props) => {
  const setRoom = useSetRoom();
  const { users } = useRoom();
  const { handleAddUser, handleRemoveUser } = useSetUsers();

  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const minimapRef = useRef(null);
  const selectionRefs = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [moveImage, setMoveImage] = useState({ base64: "" });

  useEffect(() => {
    socket.on("room", (room, usersMovesToParse, usersToParse) => {
      const usersMoves = new Map(JSON.parse(usersMovesToParse));
      const usersParsed = new Map(JSON.parse(usersToParse));

      const newUsers = new Map();

      usersParsed.forEach((name, id) => {
        if (id === socket.id) return null;

        const index = [...usersParsed.keys()].indexOf(id);
        const color = COLORS_ARRAY[index % COLORS_ARRAY.length];
        newUsers.set(id, { name, color });
      });

      setRoom((prev) => ({
        ...prev,
        users: newUsers,
        usersMoves,
        movesWithoutUsers: room.drawed,
      }));
    });

    socket.on("new_user", (userId, username) => {
      toast(`${username} has joined the room`, {
        position: "top-center",
        theme: "colored",
      });
      handleAddUser(userId, username);
    });

    socket.on("user_disconnected", (disconnectedUser) => {
      toast(
        `${users.get(disconnectedUser)?.name || "Anonymous"} has left the room`,
        {
          position: "top-center",
          theme: "colored",
        }
      );
      handleRemoveUser(disconnectedUser);
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
        setMoveImage,
        minimapRef,
        canvasRef,
        moveImage,
        selectionRefs,
      }}
      {...props}
    />
  );
};
