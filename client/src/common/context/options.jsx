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
    lineColor: "#000",
    lineWidth: 5,
  });

  const updateOptions = (newOptions) => {
    setOptions((prevOptions) => ({ ...prevOptions, ...newOptions }));
  };

  return (
    <OptionsContext.Provider value={{ options, updateOptions }} {...props} />
  );
};
