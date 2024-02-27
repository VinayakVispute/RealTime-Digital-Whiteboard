import { useRef } from "react";

import { motion } from "framer-motion";
import { useInterval, useMouse } from "react-use";

import { getPos } from "../../../../common/lib/getPos";
import { socket } from "../../../../common/lib/socket";

import { useBoardPosition } from "../../hooks/useBoardPosition";

const MousePosition = () => {
  const { x, y } = useBoardPosition();

  const prevPosition = useRef({ x: 0, y: 0 });

  const ref = useRef(null);

  const { docX, docY } = useMouse(ref);

  const touchDevice = window.matchMedia("(pointer:coarse)").matches;

  useInterval(() => {
    if (prevPosition.current.x !== docX || prevPosition.current.y !== docY) {
      socket.emit("mouse_move", getPos(docX, x), getPos(docY, y));
      prevPosition.current = { x: docX, y: docY };
    }
  }, 150);

  if (touchDevice) return null;

  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 z-50  text-lg pointer-events-none select-none transition-colors"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.03, ease: "linear" }}
    >
      {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
