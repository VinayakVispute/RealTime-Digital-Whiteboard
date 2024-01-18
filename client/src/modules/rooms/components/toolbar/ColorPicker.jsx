import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { BsPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";
import { useOptions } from "../../../../common/context/Options";
import { ColorPickerAnimateion } from "../../animation/ColorPickerAnimation";

const ColorPicker = () => {
  const { options, setOptions } = useOptions();

  const ref = useRef(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="h-6 w-6 rounded-full border-2 border-white transition-all hover:scale-125 active:scale-100"
        style={{
          backgroundColor: options.lineColor,
          boxShadow: `0 0 0 2px ${options.lineColor}`,
        }}
        onClick={() => setOpened(!opened)}
        // disabled={options.mode === "select"}
      >
        {/* <BsPaletteFill /> */}
        <AnimatePresence>
          {opened && (
            <motion.div
              className="absolute top-0 left-14"
              // variants={ColorPickerAnimateion}
              initial="from"
              animate="to"
              exit="from"
            >
              <HexColorPicker
                color={options.lineColor}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, lineColor: e }))
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default ColorPicker;
