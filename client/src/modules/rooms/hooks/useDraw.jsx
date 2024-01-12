import { useState, useEffect, useCallback } from "react";
import { socket } from "../../../common/lib/socket";
import { useOptionsValue } from "../../../common/context/Options";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "../../../common/lib/getPos";
import { useMyMoves } from "../../../common/context/RoomId";

let tempMoves = [];

const useDraw = (ctx, blocked) => {
  const { handleRemoveMyMove, handleAddMyMove } = useMyMoves();

  const boardPosition = useBoardPosition();
  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const options = useOptionsValue();
  console.log("options", options);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  });

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

    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();
    tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();
    const move = {
      options,
      path: tempMoves,
    };
    handleAddMyMove(move);

    tempMoves = [];

    socket.emit("draw", move);
  };

  const handleDraw = (x, y) => {
    if (!ctx || !drawing || blocked) return;

    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
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
