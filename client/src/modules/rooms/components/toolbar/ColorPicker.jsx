import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RgbColorPicker } from "react-colorful";
import { useClickAway } from "react-use";
import { BsPaletteFill } from "react-icons/bs";
import { useOptions } from "../../../../common/recoil/options";

const ColorPicker = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => {
    setOpened(false);
  });

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className=""
        onClick={() => {
          setOpened((prev) => !prev);
        }}
        disabled={options.mode === "select"}
      >
        <BsPaletteFill />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-10 mt-24 sm:left-14"
            initial="from"
            animate="to"
            exit="from"
          >
            <h2 className="ml-3 font-semibold text-black">Line Color</h2>
            <RgbColorPicker
              color={options.lineColor}
              onChange={(e) => {
                setOptions({ ...options, lineColor: e });
              }}
              className="mb-5 "
            />
            <h2 className="ml-3 font-semibold text-black">Fill Color </h2>
            <RgbColorPicker
              color={options.fillColor}
              onChange={(e) => {
                setOptions({ ...options, fillColor: e });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
