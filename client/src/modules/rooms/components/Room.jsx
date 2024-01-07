import React from "react";
import { RoomProvider } from "../context/Room";
import Canvas from "./Canvas";
import MousePosition from "./MousePosition";
import MouseRenderer from "./MouseRenderer";

const Room = () => {
  return (
    <RoomProvider>
      <div className="relative w-full h-full overflow-hidden">
        <Canvas />
        <MousePosition />
        <MouseRenderer />
      </div>
    </RoomProvider>
  );
};

export default Room;
