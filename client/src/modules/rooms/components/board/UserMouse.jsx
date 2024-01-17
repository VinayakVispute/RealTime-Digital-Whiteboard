import { useEffect, useState } from "react";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import { socket } from "../../../../common/lib/socket";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";
import { useRoom } from "../../../../common/context/RoomId";

const UserMouse = ({ userId }) => {
  const { users } = useRoom();
  const [msg, setMsg] = useState("");
  const boardPosition = useBoardPosition();
  const [x, setX] = useState(boardPosition.x.get());
  const [y, setY] = useState(boardPosition.y.get());
  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    const unsubscribeX = boardPosition.x.onChange(setX);
    const unsubscribeY = boardPosition.y.onChange(setY);
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [boardPosition.x, boardPosition.y]);

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
  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-800 ${
        pos.x === -1 && "hidden"
      } pointer-events-none`}
      style={{ color: users.get(userId)?.color }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-w-[15rem] overflow-hidden text-ellipsis rounded-md bg-zinc-900 p-1 px-3 text-white ">
          {msg}
        </p>
      )}
      <p className="text-xs ml-2">{users.get(userId)?.name || "Anonymous"}</p>
    </motion.div>
  );
};

export default UserMouse;
