import { useContext, createContext, useState } from "react";

const RoomContext = createContext();

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

export const RoomProvider = (props) => {
  const [id, setId] = useState("");

  return <RoomContext.Provider value={{ id, setId }} {...props} />;
};

export const useRoomId = () => {
  const { id } = useRoomContext();
  return id;
};

export const useSetRoomId = () => {
  const { setId } = useRoomContext();
  return setId;
};
