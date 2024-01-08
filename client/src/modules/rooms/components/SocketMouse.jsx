import { useEffect, useState } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { socket } from "../../../common/lib/socket";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

const SocketMouse = ({ userId }) => {
  console.log("SocketMouse");
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
      console.log("mouse_moved");
      if (socketIdMoved === userId) {
        setPos({
          x: newX,
          y: newY,
        });
      }
    };

    socket.on("mouse_moved", handleMouseMoved);

    return () => {
      socket.off("mouse_moved", handleMouseMoved);
    };
  }, [userId]);

  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-800 ${
        pos.x === -1 && "hidden"
      }`}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ duration: 0.3 }}
    >
      <BsCursorFill className="-rotate-90" />
    </motion.div>
  );
};

export default SocketMouse;
