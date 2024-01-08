import { useState, useEffect, useCallback } from "react";
import { socket } from "../../../common/lib/socket";
import { useOptions } from "../../../common/context/Options";
import { drawonUndo } from "../helpers/CanvasHelpers";
import { useUsers, useUsersContext } from "../../../common/context/Users";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "../../../common/lib/getPos";

let moves = [];
const savedMoves = [];

export const useDraw = (ctx, blocked, handleEnd) => {
  const users = useUsers();
  const { options } = useOptions();
  const [drawing, setDrawing] = useState(false);
  const boardPosition = useBoardPosition();

  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  }, [ctx, options]);

  const handleUndo = useCallback(() => {
    if (ctx) {
      savedMoves.pop();
      socket.emit("undo");
      drawonUndo(ctx, savedMoves, users);
      handleEnd();
    }
  }, [ctx, handleEnd, users]);

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
    if (!ctx || blocked) return;
    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();
    savedMoves.push(moves);

    socket.emit("draw", moves, options);

    moves = [];

    handleEnd();
  };

  const handleDraw = (x, y) => {
    if (!ctx || !drawing || blocked) return;

    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    moves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDraw,
    handleUndo,
    drawing,
  };
};

export const useSocketDraw = (ctx, handleEnd) => {
  const { UpdateUsers } = useUsersContext();

  useEffect(() => {
    const handleUserDraw = (newMoves, options, userId) => {
      if (ctx) {
        ctx.lineWidth = options.lineWidth;
        ctx.strokeStyle = options.lineColor;

        ctx.beginPath();

        newMoves.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });

        ctx.stroke();
        ctx.closePath();
        handleEnd();
        UpdateUsers((prev) => {
          const newUsers = { ...prev };
          newUsers[userId] = [...newUsers[userId], newMoves];
          return newUsers;
        });
      }
    };

    const handleUserUndo = (userId) => {
      UpdateUsers((prev) => {
        const newUsers = { ...prev };
        newUsers[userId] = newUsers[userId].slice(0, -1); // remove last move from user
        if (ctx) {
          // Assuming drawonUndo is a separate function you've defined elsewhere
          drawonUndo(ctx, savedMoves, newUsers);
          handleEnd();
        }
        return newUsers;
      });
    };
    socket.on("user_draw", handleUserDraw);
    socket.on("user_undo", handleUserUndo);

    return () => {
      socket.off("user_draw", handleUserDraw);
      socket.off("user_undo", handleUserUndo);
    };
  }, [ctx, handleEnd, UpdateUsers]);
};
