import { useRef, useState, useEffect } from "react";
import { useViewportSize } from "../../../../common/hooks/useViewportSize";
import { useKeyPressEvent } from "react-use";
import { motion } from "framer-motion";
import { CANVAS_SIZE } from "../../../../common/constants/canvasSize";
import MiniMap from "./MiniMap";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import { useRoom } from "../../../../common/context/RoomId";
import { socket } from "../../../../common/lib/socket";
import { drawAllMoves } from "../../helpers/CanvasHelpers";
import useDraw from "../../hooks/useDraw";
import useSocketDraw from "../../hooks/useSocketDraw";
import Background from "./Background";
import { useOptionsValue } from "../../../../common/context/Options";

const Canvas = ({ undoRef }) => {
  const room = useRoom();
  const options = useOptionsValue();
  const canvasRef = useRef(null);
  const smallCanvasRef = useRef(null);

  const [ctx, setCtx] = useState();
  const [dragging, setDragging] = useState(false);
  const [, setMovedMiniMap] = useState(false);
  const { height, width } = useViewportSize();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    } else {
      setDragging(false);
    }
  });

  const { x, y } = useBoardPosition();

  const copyCanvasToSmall = () => {
    if (canvasRef.current && smallCanvasRef.current) {
      const smallCtx = smallCanvasRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
      }
    }
  };

  const {
    handleDraw,
    handleEndDrawing,
    handleStartDrawing,
    handleUndo,
    drawing,
  } = useDraw(ctx, dragging);

  useSocketDraw(ctx, drawing);

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) {
      setCtx(newCtx);
    }
    const handleKeyUp = (e) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    const undoButn = undoRef.current;
    undoButn?.addEventListener("click", handleUndo);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      undoButn?.removeEventListener("click", handleUndo);
    };
  }, [dragging, handleUndo, undoRef]);

  useEffect(() => {
    if (ctx) socket.emit("joined_room");
  }, [ctx]);

  useEffect(() => {
    if (ctx) {
      drawAllMoves(ctx, room, options);
      copyCanvasToSmall();
    }
  }, [ctx, room, options]);

  return (
    <div className=" relative w-full h-full ">
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging && "cursor-move"} `}
        style={{ x, y }}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY, e.shiftKey);
        }}
        onTouchStart={(e) => {
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          );
        }}
        onTouchEnd={() => handleEndDrawing()}
        onTouchMove={(e) => {
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }}
      />
      <Background />
      <MiniMap
        ref={smallCanvasRef}
        dragging={dragging}
        setMovedMiniMap={setMovedMiniMap}
      />
    </div>
  );
};

export default Canvas;
