import { useContext, createContext, useState } from "react";
import { getNextColor } from "../lib/getNextColor";

const RoomIdContext = createContext();

export const useRoomIdContext = () => {
  const context = useContext(RoomIdContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};
export const DEFAULT_ROOM = {
  id: "",
  users: new Map(),
  usersMoves: new Map(),
  movesWithoutUsers: [],
  myMoves: [],
};

export const RoomIdProvider = (props) => {
  const [room, setRoom] = useState(DEFAULT_ROOM);

  const setIdContextRoomId = (id) => {
    return setRoom({ ...DEFAULT_ROOM, id });
  };

  return (
    <RoomIdContext.Provider
      value={{ setIdContextRoomId, setRoom, room }}
      {...props}
    />
  );
};

export const useRoom = () => {
  const { room } = useRoomIdContext();
  return room;
};

export const useRoomId = () => {
  const { id } = useRoomIdContext();
  return id;
};

export const setRoomIdContext = () => {
  const { setRoom } = useRoomIdContext();
  return setRoom;
};

export const useSetUsers = () => {
  const { setRoom } = useRoomIdContext();

  const handleAddUser = (userId, name) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const newUsersMoves = prev.usersMoves;
      const color = getNextColor([...newUsers.values()].pop()?.color);
      newUsers.set(userId, { name, color });
      newUsersMoves.set(userId, []);
      return { ...prev, users: newUsers, usersMoves: newUsersMoves };
    });
  };

  const handleRemoveUser = (userId) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const newUsersMoves = prev.usersMoves;
      const userMoves = newUsersMoves.get(userId);
      newUsers.delete(userId);
      newUsersMoves.delete(userId);
      return {
        ...prev,
        users: newUsers,
        usersMoves: newUsersMoves,
        movesWithoutUsers: [...prev.movesWithoutUsers, ...(userMoves || [])],
      };
    });
  };
  const handleAddMoveToUser = (userId, moves) => {
    setRoom((prev) => {
      const newUsersMoves = prev.usersMoves;
      const oldMoves = prev.usersMoves.get(userId);
      newUsersMoves.set(userId, [...(oldMoves || []), moves]);
      return { ...prev, usersMoves: newUsersMoves };
    });
  };

  const handleRemoveMoveFromUser = (userId) => {
    setRoom((prev) => {
      const newUsersMoves = prev.usersMoves;
      const oldMoves = prev.usersMoves.get(userId);
      oldMoves?.pop();
      newUsersMoves.set(userId, oldMoves || []);
      return { ...prev, usersMoves: newUsersMoves };
    });
  };

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

export const useMyMoves = () => {
  const { room, setRoom } = useRoomIdContext();

  const handleAddMyMove = (move) => {
    setRoom((prev) => ({ ...prev, myMoves: [...prev.myMoves, move] }));
  };

  const handleRemoveMyMove = () => {
    const newMoves = [...room.myMoves];
    const move = newMoves.pop();
    setRoom((prev) => ({ ...prev, myMoves: newMoves }));

    return move;
  };
  return { myMoves: room.myMoves, handleAddMyMove, handleRemoveMyMove };
};
