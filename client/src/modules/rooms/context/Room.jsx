import { useMotionValue } from "framer-motion";
import { createContext, useContext, useEffect } from "react";
import { socket } from "../../../common/lib/socket";
import { setRoomIdContext, useSetUsers } from "../../../common/context/RoomId";
const roomContext = createContext({
  x: null,
  y: null,
});

export const useRoomContext = () => {
  const context = useContext(roomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

export const RoomProvider = (props) => {
  const setRoom = setRoomIdContext();
  const { handleAddUser, handleRemoveUser } = useSetUsers();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    socket.on("room", (room, usersMovesToParse, usersToParse) => {
      const usersMoves = new Map(JSON.parse(usersMovesToParse));
      const users = new Map(JSON.parse(usersToParse));
      setRoom((prev) => ({
        ...prev,
        users,
        usersMoves,
        movesWithoutUser: room.drawed,
      }));
    });

    socket.on("new_user", (userId, username) => {
      handleAddUser(userId, username);
    });

    socket.on("user_disconnected", (disconnectedUser) => {
      handleRemoveUser(disconnectedUser);
    });

    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnected");
    };
  }, [handleAddUser, handleRemoveUser, setRoom]);

  return <roomContext.Provider value={{ x, y }} {...props} />;
};
