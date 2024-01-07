import { useMotionValue } from "framer-motion";

export const roomContext = createContext(null);

const roomContext = {
  x: null,
  y: null,
};

export const useRoomContext = () => {
  const context = useContext(roomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

export const RoomProvider = (props) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return <roomContext.Provider value={{ x, y }} {...props} />;
};
