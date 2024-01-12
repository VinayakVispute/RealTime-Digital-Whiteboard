import { useEffect } from "react";
import { socket } from "../../../common/lib/socket";
import { handleMove } from "../helpers/CanvasHelpers";
import { useSetUsers } from "../../../common/context/RoomId";

const useSocketDraw = (ctx, drawing) => {
  const { handleRemoveMoveFromUser, handleAddMoveToUser } = useSetUsers();

  useEffect(() => {
    let moveToDrawLater;
    let userIdLater = "";
    socket.on("user_draw", (move, userId) => {
      if (ctx && !drawing) {
        handleAddMoveToUser(userId, move);
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");
      if (moveToDrawLater && userIdLater && ctx) {
        handleMove(moveToDrawLater, ctx);
        handleAddMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [ctx, handleAddMoveToUser, drawing]);

  useEffect(() => {
    const handleUserUndo = (userId) => {
      handleRemoveMoveFromUser(userId);
    };

    socket.on("user_undo", handleUserUndo);
    return () => {
      socket.off("user_undo", handleUserUndo);
    };
  }, [ctx, handleRemoveMoveFromUser]);
};

export default useSocketDraw;
