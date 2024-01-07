import { useRoomContext } from "../context/RoomContext";

export const useBoardPosition = () => {
  const { x, y } = useRoomContext();
};
