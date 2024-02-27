import { useRoomContext } from "../context/Room";

const useRefs = () => {
  const { undoRef, redoRef, bgRef, canvasRef, minimapRef, selectionRefs } =
    useRoomContext();

  return { undoRef, redoRef, bgRef, canvasRef, minimapRef, selectionRefs };
};

export default useRefs;
