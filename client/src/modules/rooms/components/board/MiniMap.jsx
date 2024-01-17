import { forwardRef, useEffect, useRef } from "react";
import { useViewportSize } from "../../../../common/hooks/useViewportSize";
import { useMotionValue, motion } from "framer-motion";
import { CANVAS_SIZE } from "../../../../common/constants/canvasSize";
import { useBoardPosition } from "../../hooks/useBoardPosition";

const MiniMap = forwardRef((props, ref) => {
  const { dragging, setMovedMiniMap } = props;
  const { x, y } = useBoardPosition();
  const containerRef = useRef(null);
  const { width, height } = useViewportSize();
  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  useEffect(() => {
    miniX.onChange((newX) => {
      if (!dragging) {
        x.set(-newX * 7);
      }
    });
    miniY.onChange((newY) => {
      if (!dragging) {
        y.set(-newY * 7);
      }
    });

    return () => {
      miniX.clearListeners();
      miniY.clearListeners();
    };
  }, [dragging, miniX, miniY, x, y]);

  return (
    <div
      className="absolute top-10 right-10 z-30  border-2 border-red-500 rounded-lg bg-zinc-50"
      ref={containerRef}
      style={{
        width: CANVAS_SIZE.width / 7,
        height: CANVAS_SIZE.height / 7,
      }}
    >
      <canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{
          power: 0,
          timeConstant: 0,
        }}
        onDragStart={() => setMovedMiniMap((prev) => !prev)}
        onDragEnd={() => setMovedMiniMap((prev) => !prev)}
        className="absolute top-0 left-0 cursor-grab border-2 border-red-500"
        style={{
          width: width / 7,
          height: height / 7,
          x: miniX,
          y: miniY,
        }}
        animate={{
          x: -x.get() / 7,
          y: -y.get() / 7,
        }}
        transition={{ duration: 0 }}
      ></motion.div>
    </div>
  );
});

export default MiniMap;
