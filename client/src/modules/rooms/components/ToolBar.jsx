import React from "react";
import { useOptions } from "../../../common/context/Options";

const ToolBar = () => {
  const { updateOptions } = useOptions();

  // Array of color options
  const colorOptions = [
    "red",
    "green",
    "blue",
    "black",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "pink",
    "brown",
  ];

  return (
    <div className="absolute left-0 top-0 z-50 flex gap-5 bg-black text-white">
      {colorOptions.map((color, index) => (
        <button
          key={index}
          onClick={() =>
            updateOptions((prev) => ({ ...prev, lineColor: color }))
          }
          style={{
            backgroundColor: color,
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1px solid white",
          }}
        >
          {/* You can add a label or empty content here */}
        </button>
      ))}
    </div>
  );
};

export default ToolBar;
