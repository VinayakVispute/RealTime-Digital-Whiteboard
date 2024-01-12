import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { OptionsProvider } from "./common/context/Options";
import { RoomProvider } from "./modules/rooms/context/Room.jsx";
import { UsersProvider } from "./common/context/Users.jsx";
import { RoomIdProvider } from "./common/context/RoomId.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <OptionsProvider>
    <UsersProvider>
      <RoomIdProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </RoomIdProvider>
    </UsersProvider>
  </OptionsProvider>
);
