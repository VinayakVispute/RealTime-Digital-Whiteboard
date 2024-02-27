import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RoomProvider } from "./modules/rooms/context/Room.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <ToastContainer />
    <RoomProvider>
      <App />
    </RoomProvider>
  </RecoilRoot>
);
