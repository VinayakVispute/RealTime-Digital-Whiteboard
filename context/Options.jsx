import { createContext, useContext, useState } from "react";

const OptionsContext = createContext();

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within a OptionsProvider");
  }
  return context;
};

export const OptionsProvider = (props) => {
  const [options, setOptions] = useState({
    lineColor: { r: 0, g: 0, b: 0, a: 1 },
    fillColor: { r: 0, g: 0, b: 0, a: 0 },
    lineWidth: 5,
    mode: "draw",
    shape: "line",
    selection: null,
  });

  const updateOptions = (newOptions) => setOptions(newOptions);

  return (
    <OptionsContext.Provider
      value={{ options, setOptions, updateOptions }}
      {...props}
    />
  );
};

export const useOptionsValue = () => {
  const { options } = useOptions();
  return options;
};

export const useSetSelection = () => {
  const { setOptions } = useOptions();
  const setSelection = (x, y, width, height) => {
    setOptions((prev) => ({
      ...prev,
      selection: { x, y, width, height },
    }));
  };

  const clearSelection = () => {
    setOptions((prev) => {
      return {
        ...prev,
        selection: null,
      };
    });
  };

  return { clearSelection, setSelection };
};
