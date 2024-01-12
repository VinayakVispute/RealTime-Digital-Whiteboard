import { useContext, createContext, useState } from "react";

const RoomIdContext = createContext();

export const useRoomIdContext = () => {
  const context = useContext(RoomIdContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

export const RoomIdProvider = (props) => {
  const [room, setRoom] = useState({
    id: "",
    users: new Map(),
    movesWithoutUser: [],
    myMoves: [],
  });

  const setIdContextRoomId = (id) => {
    return setRoom((prev) => ({ ...prev, id }));
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

  const handleAddUsers = (userId) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      newUsers.set(userId, []);
      return { ...prev, users: newUsers };
    });
  };

  const handleRemoveUser = (userId) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const userMoves = newUsers.get(userId);
      newUsers.delete(userId);
      return {
        ...prev,
        users: newUsers,
        movesWithoutUser: [...prev.movesWithoutUser, ...(userMoves || [])],
      };
    });
  };
  const handleAddMoveToUser = (userId, moves) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const oldMoves = prev.users.get(userId);
      newUsers.set(userId, [...(oldMoves || []), moves]);
      return { ...prev, users: newUsers };
    });
  };

  const handleRemoveMoveFromUser = (userId) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const oldMoves = prev.users.get(userId);
      oldMoves?.pop();
      newUsers.set(userId, oldMoves || []);
      return { ...prev, users: newUsers };
    });
  };

  return {
    handleAddUsers,
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
    newMoves.pop();
    setRoom((prev) => ({ ...prev, myMoves: newMoves }));
  };
  return { myMoves: room.myMoves, handleAddMyMove, handleRemoveMyMove };
};
