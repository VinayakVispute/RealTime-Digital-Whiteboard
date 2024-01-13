import { useEffect } from "react";
import { RoomProvider } from "../context/Room";
import Canvas from "./Canvas";
import MousePosition from "./MousePosition";
import MouseRenderer from "./MouseRenderer";
import ToolBar from "./ToolBar/ToolBar";
import { useRoom, useRoomIdContext } from "../../../common/context/RoomId";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../common/lib/socket";
import NameInput from "./NameInput";

const Room = () => {
  const room = useRoom();
  if (!room.id) return <NameInput />;
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
