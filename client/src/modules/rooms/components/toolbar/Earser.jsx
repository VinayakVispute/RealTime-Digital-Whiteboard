import { useOptions } from "../../../../common/context/Options";
import { FaEraser } from "react-icons/fa";
const Earser = () => {
  const { options, setOptions } = useOptions();
  return (
    <button
      className={`text-xl ${options.erase && "bg-green-400"}`}
      onClick={() => {
        setOptions((prev) => ({ ...prev, erase: !prev.erase }));
      }}
    >
      <FaEraser />
    </button>
  );
};

export default Earser;
