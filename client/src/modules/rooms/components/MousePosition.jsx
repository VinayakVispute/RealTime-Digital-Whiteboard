import { useRef } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useInterval, useMouse } from "react-use";
import { socket } from "../../../common/lib/socket";
import { motion } from "framer-motion";

const MousePosition = () => {
  const prePosition = useRef({ x: 0, y: 0 });
  const { x, y } = useBoardPosition();
  const ref = useRef(null);
  const { docX, docY } = useMouse(ref);

  useInterval(() => {
    if (prePosition.current.x !== docX || prePosition.current.y !== docY) {
      socket.emit("mouse_moved", docX - x.get(), docY - y.get());
      prePosition.current = { x: docX, y: docY };
    }
  }, 300);
  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 z-50 select-none"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.03, ease: "linear" }}
    >
      {docX - x.get()}, {docY - y.get()}
    </motion.div>
  );
};

export default MousePosition;
