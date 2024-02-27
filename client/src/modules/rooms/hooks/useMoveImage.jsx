import { useRoomContext } from "../context/Room";

const useMoveImage = () => {
  const { moveImage, setMoveImage } = useRoomContext();

  return { moveImage, setMoveImage };
};

export default useMoveImage;
