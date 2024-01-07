import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { OptionsProvider } from "./common/context/Options";
import { RoomProvider } from "./modules/rooms/context/Room.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OptionsProvider>
      <RoomProvider>
        <App />
      </RoomProvider>
    </OptionsProvider>
  </React.StrictMode>
);
