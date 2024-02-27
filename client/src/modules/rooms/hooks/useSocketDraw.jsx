import { useEffect } from "react";
import { socket } from "../../../common/lib/socket";
import { useSetUsers } from "../../../common/recoil/room";
const useSocketDraw = (drawing) => {
  const { handleRemoveMoveFromUser, handleAddMoveToUser } = useSetUsers();

  useEffect(() => {
    let moveToDrawLater;
    let userIdLater = "";
    socket.on("user_draw", (move, userId) => {
      if (!drawing) {
        handleAddMoveToUser(userId, move);
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");
      if (moveToDrawLater && userIdLater) {
        handleAddMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [handleAddMoveToUser, drawing]);

  useEffect(() => {
    const handleUserUndo = (userId) => {
      handleRemoveMoveFromUser(userId);
    };

    socket.on("user_undo", handleUserUndo);
    return () => {
      socket.off("user_undo", handleUserUndo);
    };
  }, [handleRemoveMoveFromUser]);
};

export default useSocketDraw;
