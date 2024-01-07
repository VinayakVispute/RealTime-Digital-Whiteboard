import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { OptionsProvider } from "./common/context/options";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OptionsProvider>
      <App />
    </OptionsProvider>
  </React.StrictMode>
);
