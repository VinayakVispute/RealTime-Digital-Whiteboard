import { useRef, useState, useEffect } from "react";
import { useViewportSize } from "../../../common/hooks/useViewportSize";
import { useKeyPressEvent } from "react-use";
import { useMotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { CANVAS_SIZE } from "../../../common/constants/canvasSize";
import { useDraw } from "../hooks/CanvasHooks";
import { socket } from "../../../common/lib/socket";
import { drawFromSocket } from "../helpers/CanvasHelpers";
import MiniMap from "./MiniMap";
import { useOptions } from "../../../common/context/options";

const Canvas = () => {
  const canvasRef = useRef(null);
  const smallCanvasRef = useRef(null);

  const [ctx, setCtx] = useState();
  const [dragging, setDragging] = useState(false);
  const [, setMovedMiniMap] = useState(false);
  const { options } = useOptions();
  const { height, width } = useViewportSize();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !drawing) {
      setDragging(true);
    }
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const copyCanvasToSmall = () => {
    if (canvasRef.current) {
      smallCanvasRef.current
        ?.getContext("2d")
        ?.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
    }
  };
  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing } = useDraw(
    ctx,
    dragging,
    -x.get(),
    -y.get(),
    copyCanvasToSmall
  );

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) {
      console.log("newCtx", newCtx);
      setCtx(newCtx);
    }
    const handleKeyUp = (e) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dragging]);

  useEffect(() => {
    let movesToDrawLeter = [];
    let optionsToUseLater = {
      lineColor: "",
      lineWidth: 0,
    };
    socket.on("socket_draw", (movesToDraw, socketOptions) => {
      if (ctx && !drawing) {
        drawFromSocket(movesToDraw, socketOptions, ctx, copyCanvasToSmall);
      } else {
        movesToDrawLeter = movesToDraw;
        optionsToUseLater = socketOptions;
      }
    });
    return () => {
      socket.off("socket_draw");
      if (movesToDrawLeter.length && ctx) {
        drawFromSocket(
          movesToDrawLeter,
          optionsToUseLater,
          ctx,
          copyCanvasToSmall
        );
      }
    };
  }, [drawing, ctx]);

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`bg-zinc-300 ${dragging && "cursor-move"} `}
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
          handleDraw(e.clientX, e.clientY);
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
      <MiniMap
        ref={smallCanvasRef}
        x={x}
        y={y}
        dragging={dragging}
        setMovedMiniMap={setMovedMiniMap}
      />
    </div>
  );
};

export default Canvas;
