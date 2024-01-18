import { useState, useEffect, useCallback } from "react";
import { socket } from "../../../common/lib/socket";
import { useOptionsValue } from "../../../common/context/Options";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "../../../common/lib/getPos";
import { useMyMoves, useRoom } from "../../../common/context/RoomId";

import {
  drawAllMoves,
  drawCircle,
  drawLine,
  drawRect,
} from "../helpers/CanvasHelpers";

let tempMoves = [];

const setCtxOptions = (ctx, options) => {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;
  if (options.erase) ctx.globalCompositeOperation = "destination-out";
};

let tempRadius = 0;
let tempSize = { width: 0, height: 0 };

const useDraw = (ctx, blocked) => {
  const room = useRoom();
  const options = useOptionsValue();

  const { handleRemoveMyMove, handleAddMyMove } = useMyMoves();

  const boardPosition = useBoardPosition();
  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
      if (options.erase) ctx.globalCompositeOperation = "destination-out";
    }
  });

  useEffect(() => {
    socket.on("your_move", (move) => {
      handleAddMyMove(move);
    });

    return () => {
      socket.off("your_move");
    };
  }, [handleAddMyMove]);

  const handleUndo = useCallback(() => {
    if (ctx) {
      handleRemoveMyMove();
      socket.emit("undo");
    }
  }, [ctx, handleRemoveMyMove]);

  useEffect(() => {
    const handleUndoKeyboard = (e) => {
      if (e.ctrlKey && e.key === "z") {
        handleUndo();
      }
    };
    document.addEventListener("keydown", handleUndoKeyboard);
    return () => {
      document.removeEventListener("keydown", handleUndoKeyboard);
    };
  }, [handleUndo]);

  const handleStartDrawing = (x, y) => {
    if (!ctx || blocked || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);

    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(finalX, finalY);
    ctx.stroke();
    tempMoves.push([finalX, finalY]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    if (options.shape !== "circle") tempRadius = 0;
    if (options.shape !== "rect") tempSize = { width: 0, height: 0 };

    const move = {
      ...tempSize,
      shape: options.shape,
      radius: tempRadius,
      options,
      path: tempMoves,
      timestamp: 0,
      erase: options.erase,
    };

    tempMoves = [];
    ctx.globalCompositeOperation = "source-over";
    socket.emit("draw", move);
  };

  const handleDraw = (x, y, shift) => {
    if (!ctx || !drawing || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);

    switch (options.shape) {
      case "line":
        if (shift) {
          tempMoves = tempMoves.slice(0, 1);
          drawAllMoves(ctx, room, options);
        }
        drawLine(ctx, tempMoves[0], finalX, finalY, shift);
        tempMoves.push([finalX, finalY]);
        break;
      case "circle":
        drawAllMoves(ctx, room, options);
        tempRadius = drawCircle(ctx, tempMoves[0], finalX, finalY);
        break;
      case "rect":
        drawAllMoves(ctx, room, options);
        tempSize = drawRect(ctx, tempMoves[0], finalX, finalY);
        break;
      default:
        break;
    }
  };

  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDraw,
    handleUndo,
    drawing,
  };
};

export default useDraw;
