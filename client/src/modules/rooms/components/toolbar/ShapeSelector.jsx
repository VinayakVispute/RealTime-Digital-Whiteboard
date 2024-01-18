import { useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { BiRectangle } from "react-icons/bi";
import { useClickAway } from "react-use";
import { BsPencilFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { ColorPickerAnimateion } from "../../animation/ColorPickerAnimation";
import { useOptions } from "../../../../common/context/Options";
const ShapeSelector = () => {
  const ref = useRef(null);
  const { options, setOptions } = useOptions();
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const handleShapeChange = (shape) => {
    setOptions((prev) => ({ ...prev, shape }));

    setOpened(false);
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <button className="text-xl" onClick={() => setOpened((prev) => !prev)}>
        {options.shape === "circle" && <FaCircle />}
        {options.shape === "rect" && <BiRectangle />}
        {options.shape === "line" && <BsPencilFill />}
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 flex gap-1 rounded-lg bg-zinc-900 p-2"
            // variants={ColorPickerAnimateion}
            initial="from"
            animate="to"
            exit="from"
          >
            <button
              className="text-xl"
              onClick={() => handleShapeChange("circle")}
            >
              <FaCircle />
            </button>
            <button
              className="text-xl"
              onClick={() => handleShapeChange("rect")}
            >
              <BiRectangle />
            </button>
            <button
              className="text-xl"
              onClick={() => handleShapeChange("line")}
            >
              <BsPencilFill />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;
