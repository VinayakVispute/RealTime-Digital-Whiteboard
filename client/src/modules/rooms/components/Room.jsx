import { RoomProvider } from "../context/Room";
import Canvas from "./board/Canvas";
import MousePosition from "./board/MousePosition";
import MouseRenderer from "./board/MouseRenderer";
import ToolBar from "./ToolBar/ToolBar";
// import { useRoom } from "../../../common/context/RoomId";
import NameInput from "./NameInput";
import UserList from "./UserList";
import Chat from "./chat/Chat";
import MoveImage from "./board/MoveImage";
import { useRoom } from "../../../common/recoil/room";
import SelectionBtns from "./board/SelectionBtns";

const Room = () => {
  const room = useRoom();

  if (!room.id) return <NameInput />;

  return (
    <RoomProvider>
      <div className="relative h-full w-full ">
        <UserList />
        <ToolBar />
        <MoveImage />
        <Canvas />
        <MousePosition />
        <MouseRenderer />
        {/* <Chat />/ */}
      </div>
    </RoomProvider>
  );
};

export default Room;
