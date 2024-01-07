import { useState, useEffect } from "react";
import { socket } from "../lib/socket";
let moves = [];

export const useDraw = (options, ctx) => {
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
    if (!ctx) return;
    moves = [[x, y]];
    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEndDrawing = () => {
    if (!ctx) return;

    socket.emit("draw", moves, options);
    setDrawing(false);
    ctx.closePath();
  };

  const handleDraw = (x, y) => {
    if (ctx && drawing) {
      moves.push([x, y]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDraw,
    drawing,
  };
};
