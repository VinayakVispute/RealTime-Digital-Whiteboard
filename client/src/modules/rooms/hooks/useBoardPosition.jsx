import { useRoomContext } from "../context/Room";

export const useBoardPosition = () => {
  const { x, y } = useRoomContext();
  return { x, y };
};
