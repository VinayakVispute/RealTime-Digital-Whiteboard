import { useContext, createContext, useState } from "react";

const RoomIdContext = createContext();

export const useRoomIdContext = () => {
  const context = useContext(RoomIdContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

export const RoomIdProvider = (props) => {
  const [id, setId] = useState("");

  const setContextRoomId = (id) => {
    return setId(id);
  };

  return <RoomIdContext.Provider value={{ id, setContextRoomId }} {...props} />;
};

export const useRoomId = () => {
  const { id } = useRoomIdContext();
  return id;
};
