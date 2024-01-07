import { useState, useEffect } from "react";
import { socket } from "../../../common/lib/socket";
import { useOptions } from "../../../common/context/Options";

let moves = [];

export const useDraw = (ctx, blocked, movedX, movedY, handleEnd) => {
  const { options } = useOptions();
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  }, [ctx, options]);
  const handleStartDrawing = (x, y) => {
    if (!ctx || blocked) return;
    moves = [[x + movedX, y + movedY]];
    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(x + movedX, y + movedY);
    ctx.stroke();
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    socket.emit("draw", moves, options);
    setDrawing(false);
    ctx.closePath();
    handleEnd();
  };

  const handleDraw = (x, y) => {
    if (!ctx || !drawing || blocked) return;
    moves.push([x + movedX, y + movedY]);
    ctx.lineTo(x + movedX, y + movedY);
    ctx.stroke();
  };

  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDraw,
    drawing,
  };
};
