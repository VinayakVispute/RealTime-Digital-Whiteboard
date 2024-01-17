import { useRef } from "react";
import { RoomProvider } from "../context/Room";
import Canvas from "./board/Canvas";
import MousePosition from "./board/MousePosition";
import MouseRenderer from "./board/MouseRenderer";
import ToolBar from "./ToolBar/ToolBar";
import { useRoom, useRoomIdContext } from "../../../common/context/RoomId";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../common/lib/socket";
import NameInput from "./NameInput";
import UserList from "./UserList";
import Chat from "./chat/Chat";

const Room = () => {
  const room = useRoom();
  const undoRef = useRef(null);
  if (!room.id) return <NameInput />;
  return (
    <RoomProvider>
      <div className="relative w-full h-full ">
        <UserList />
        <ToolBar undoRef={undoRef} />
        <Canvas undoRef={undoRef} />
        <MousePosition />
        <MouseRenderer />
        <Chat />
      </div>
    </RoomProvider>
  );
};

export default Room;
