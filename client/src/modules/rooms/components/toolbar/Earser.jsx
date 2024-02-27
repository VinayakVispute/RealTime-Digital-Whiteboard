import { useOptions } from "../../../../common/context/Options";
import { FaEraser } from "react-icons/fa";
const Eraser = () => {
  const { options, setOptions } = useOptions();
  return (
    <button
      className={`text-xl ${options.eraser && "bg-green-400"}`}
      onClick={() => {
        setOptions((prev) => ({ ...prev, eraser: !prev.eraser }));
      }}
    >
      <FaEraser />
    </button>
  );
};

export default Eraser;
