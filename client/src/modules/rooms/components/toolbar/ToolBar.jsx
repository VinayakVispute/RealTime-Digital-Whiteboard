import { BsFillChatFill, BsFillImageFill, BsThreeDots } from "react-icons/bs";
import { HiOutlineDownload } from "react-icons/hi";
import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import Earser from "./Earser";
import { FaUndo } from "react-icons/fa";

const ToolBar = ({ undoRef }) => {
  return (
    <div
      className="absolute left-0 top-[15rem] z-50 flex flex-col items-center rounded-lg  gap-5 bg-zinc-900 p-5 text-white"
      style={{
        transform: "translateY(-50%)",
      }}
    >
      <button className="text-xl" ref={undoRef}>
        <FaUndo />
      </button>
      <div className="h-px wiful bg-white" />
      <ColorPicker />
      <LineWidthPicker />
      <Earser />
      <button className="text-xl">
        <BsFillChatFill />
      </button>
      <button className="text-xl">
        <BsFillImageFill />
      </button>
      <button className="text-xl">
        <BsThreeDots />
      </button>
      <button className="text-xl">
        <HiOutlineDownload />
      </button>
    </div>
  );
};

export default ToolBar;
