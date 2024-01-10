import { useState, useEffect, useCallback } from "react";
import { socket } from "../../../common/lib/socket";
import { useOptions } from "../../../common/context/Options";
import { drawAllMoves, handleMove } from "../helpers/CanvasHelpers";
import { useUsers, useUsersContext } from "../../../common/context/Users";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "../../../common/lib/getPos";

const movesWithoutUser = [];
let tempMoves = [];
const savedMoves = [];

export const useDraw = (ctx, blocked, handleEnd) => {
  const users = useUsers();

  const boardPosition = useBoardPosition();
  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const { options } = useOptions();
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
      savedMoves.pop();
      socket.emit("undo");
      drawAllMoves(ctx, movesWithoutUser, savedMoves, users);
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

    savedMoves.push(move);

    tempMoves = [];

    socket.emit("draw", move);

    drawAllMoves(ctx, movesWithoutUser, savedMoves, users);

    handleEnd();
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

export const useSocketDraw = (ctx, drawing, handleEnd) => {
  const { UpdateUsers } = useUsersContext();

  useEffect(() => {
    if (ctx) socket.emit("joined_room");
  }, [ctx]);

  useEffect(() => {
    socket.on("room", (room, usersToParse) => {
      if (!ctx) return;

      const users = new Map(JSON.parse(usersToParse));

      room.drawed.forEach((move) => {
        handleMove(move, ctx);
        movesWithoutUser.push(move);
      });

      users.forEach((userMoves, userId) => {
        userMoves.forEach((move) => handleMove(move, ctx));
        UpdateUsers((prev) => ({ ...prev, [userId]: userMoves }));
      });
      handleEnd();
    });
    return () => {
      socket.off("room");
    };
  }, [ctx, handleEnd, UpdateUsers]);

  useEffect(() => {
    let moveToDrawLater;
    let userIdLater = "";
    socket.on("user_draw", (move, userId) => {
      if (ctx && !drawing) {
        handleMove(move, ctx);
        handleEnd();
        UpdateUsers((prev) => {
          const newUsers = { ...prev };
          newUsers[userId] = [...newUsers[userId], move];
          return newUsers;
        });
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");
      if (moveToDrawLater && userIdLater && ctx) {
        handleMove(moveToDrawLater, ctx);
        handleEnd();
        UpdateUsers((prev) => {
          const newUsers = { ...prev };
          newUsers[userIdLater] = [...newUsers[userIdLater], moveToDrawLater];
          return newUsers;
        });
      }
    };
  }, [ctx, handleEnd, drawing, UpdateUsers]);

  useEffect(() => {
    const handleUserUndo = (userId) => {
      UpdateUsers((prev) => {
        const newUsers = { ...prev };
        newUsers[userId] = newUsers[userId].slice(0, -1); // remove last move from user
        if (ctx) {
          // Assuming drawonUndo is a separate function you've defined elsewhere
          drawAllMoves(ctx, movesWithoutUser, savedMoves, newUsers);
          handleEnd();
        }
        return newUsers;
      });
    };

    socket.on("user_undo", handleUserUndo);
    return () => {
      socket.off("user_undo", handleUserUndo);
    };
  }, [ctx, handleEnd, UpdateUsers]);
};
