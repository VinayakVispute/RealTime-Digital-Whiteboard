import { useMotionValue } from "framer-motion";
import { createContext, useContext, useEffect } from "react";
import { useUsersContext, useUserIds } from "../../../common/context/Users";
import { socket } from "../../../common/lib/socket";
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
  const { UpdateUsers } = useUsersContext();
  const usersIds = useUserIds();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    socket.on("users_in_room", (newUsers) => {
      console.log("users_in_room", newUsers);
      newUsers.forEach((newUser) => {
        console.log(newUser, socket.id);
        if (!usersIds.includes(newUser) && newUser !== socket.id) {
          UpdateUsers((prev) => ({ ...prev, [newUser]: [] }));
        }
      });
    });

    socket.on("user_disconnected", (disconnectedUser) => {
      UpdateUsers((prev) => {
        const newUsers = { ...prev };
        delete newUsers[disconnectedUser];
        return newUsers;
      });
    });

    return () => {
      socket.off("users_in_room");
      socket.off("user_disconnected");
    };
  }, [UpdateUsers, usersIds]);

  return <roomContext.Provider value={{ x, y }} {...props} />;
};
