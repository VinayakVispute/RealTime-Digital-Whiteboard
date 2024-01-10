import React from "react";
import { RoomProvider } from "../context/Room";
import Canvas from "./Canvas";
import MousePosition from "./MousePosition";
import MouseRenderer from "./MouseRenderer";
import ToolBar from "./ToolBar";

const Room = () => {
  return (
    <RoomProvider>
      <div className="relative w-full h-full overflow-hidden">
        <ToolBar />
        <Canvas />
        <MousePosition />
        <MouseRenderer />
      </div>
    </RoomProvider>
  );
};

export default Room;
