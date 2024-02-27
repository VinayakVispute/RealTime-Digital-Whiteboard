import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { ImExit } from "react-icons/im";
import { IoIosShareAlt } from "react-icons/io";

import { CANVAS_SIZE } from "../../../../common/constants/canvasSize";
import { DEFAULT_EASE } from "../../../../common/constants/easings";
import { useViewportSize } from "../../../../common/hooks/useViewportSize";
import useRefs from "../../hooks/useRefs";

import ColorPicker from "./ColorPicker";
import HistoryBtns from "./HistoryBtns";
import ImagePicker from "./ImagePicker";
import LineWidthPicker from "./LineWidthPicker";
import ModePicker from "./ModePicker";
import ShapeSelector from "./ShapeSelector";

const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { width } = useViewportSize();

  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (width >= 1024) setOpened(true);
    else setOpened(false);
  }, [width]);

  const handleExit = () => {
    return navigate("/");
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext("2d");

    if (tempCtx && canvasRef.current && bgRef.current) {
      tempCtx.drawImage(bgRef.current, 0, 0);
      tempCtx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click();
  };
  // const handleShare = () => openModal(<ShareModal />);

  return (
    <>
      <motion.button
        className="absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2, ease: DEFAULT_EASE }}
        onClick={() => setOpened(!opened)}
      >
        <FiChevronRight />
      </motion.button>
      <motion.div
        className="absolute left-10 top-[50%] z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white 2xl:grid-cols-1"
        animate={{
          x: opened ? 0 : -160,
          y: "-50%",
        }}
        transition={{
          duration: 0.2,
          ease: DEFAULT_EASE,
        }}
      >
        <HistoryBtns />

        <div className="h-px w-full bg-white 2xl:hidden" />
        <div className="h-px w-full bg-white" />

        <ShapeSelector />
        <ColorPicker />
        <LineWidthPicker />
        <ModePicker />
        <ImagePicker />

        <div className="2xl:hidden"></div>
        <div className="h-px w-full bg-white 2xl:hidden" />
        <div className="h-px w-full bg-white" />

        {/* <BackgroundPicker /> */}
        <button className="text-2xl" onClick={() => alert("Share")}>
          <IoIosShareAlt />
        </button>
        <button className="text-2xl" onClick={handleDownload}>
          <HiOutlineDownload />
        </button>
        <button className="text-xl" onClick={handleExit}>
          <ImExit />
        </button>
      </motion.div>
    </>
  );

  // return (
  //   <div
  //     className="absolute left-0 top-[15rem] z-50 flex flex-col items-center rounded-lg  gap-5 bg-zinc-900 p-5 text-white"
  //     style={{
  //       transform: "translateY(-50%)",
  //     }}
  //   >
  //     <HistoryBtns />
  //     <div className="h-px wiful bg-white" />
  //     <ColorPicker />
  //     <ShapeSelector />
  //     <LineWidthPicker />
  //     <ModePicker />
  //     <ImagePicker />
  //     <div className="h-px w-full bg-white" />
  //     <button className="text-2xl">
  //       <IoIosShareAlt />
  //     </button>
  //     <button className="text-2xl" onClick={handleDownload}>
  //       <HiOutlineDownload />
  //     </button>
  //     <button className="text-2xl" onClick={handleExit}>
  //       <ImExit />
  //     </button>
  //   </div>
  // );
};

export default ToolBar;
