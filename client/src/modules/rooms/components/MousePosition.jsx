import { useRef } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useInterval, useMouse } from "react-use";
import { socket } from "../../../common/lib/socket";
import { motion } from "framer-motion";
import { getPos } from "../../../common/lib/getPos";

const MousePosition = () => {
  const prePosition = useRef({ x: 0, y: 0 });
  const { x, y } = useBoardPosition();
  const ref = useRef(null);
  const { docX, docY } = useMouse(ref);

  useInterval(() => {
    if (prePosition.current.x !== docX || prePosition.current.y !== docY) {
      socket.emit("mouse_moved", getPos(docX, x), getPos(docY, y));
      prePosition.current = { x: docX, y: docY };
    }
  }, 300);
  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 z-50  text-lg pointer-events-none"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.03, ease: "linear" }}
    >
      {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
