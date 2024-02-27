import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

import { socket } from "../../../../common/lib/socket";
import { useRoom } from "../../../../common/recoil/room";

import { useBoardPosition } from "../../hooks/useBoardPosition";

const UserMouse = ({ userId }) => {
  const { users } = useRoom();
  const boardPosition = useBoardPosition();

  const [msg, setMsg] = useState("");
  const [x, setX] = useState(boardPosition.x.get());
  const [y, setY] = useState(boardPosition.y.get());
  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    const handleMouseMoved = (newX, newY, socketIdMoved) => {
      if (socketIdMoved === userId) {
        setPos({ x: newX, y: newY });
      }
    };
    const handleNewMsg = (msgUserId, newMsg) => {
      if (msgUserId === userId) {
        setMsg(newMsg);
        setTimeout(() => {
          setMsg("");
        }, 3000);
      }
    };

    socket.on("mouse_moved", handleMouseMoved);
    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("mouse_moved", handleMouseMoved);
      socket.off("new_msg", handleNewMsg);
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = boardPosition.x.onChange(setX);
    return unsubscribe;
  }, [boardPosition.x]);

  useEffect(() => {
    const unsubscribe = boardPosition.y.onChange(setY);
    return unsubscribe;
  }, [boardPosition.y]);

  return (
    <motion.div
      className={`absolute top-0 left-0 z-20 text-blue-800 ${
        pos.x === -1 && "hidden"
      } pointer-events-none`}
      style={{ color: users.get(userId)?.color }}
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-w-[15rem] max-h-20  text-ellipsis rounded-md bg-zinc-900 p-1 px-3 text-white ">
          {msg}
        </p>
      )}
      <p className="text-xs ml-2">{users.get(userId)?.name || "Anonymous"}</p>
    </motion.div>
  );
};

export default UserMouse;
