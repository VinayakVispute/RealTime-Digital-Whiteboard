import { useEffect } from "react";
import { RoomProvider } from "../context/Room";
import Canvas from "./Canvas";
import MousePosition from "./MousePosition";
import MouseRenderer from "./MouseRenderer";
import ToolBar from "./ToolBar/ToolBar";
import { useRoom, useRoomIdContext } from "../../../common/context/RoomId";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../common/lib/socket";

const Room = () => {
  const room = useRoom();
  const navigate = useNavigate();
  const { roomId } = useParams();
  console.log("params", roomId);
  const { setIdContextRoomId } = useRoomIdContext();

  useEffect(() => {
    const handleJoined = (roomIdFromServer, failed) => {
      console.log("joined", roomIdFromServer, failed);
      if (failed) {
        console.log("failed to join room");
        return navigate("/");
      } else setIdContextRoomId(roomIdFromServer);
    };

    socket.on("joined", handleJoined);
    return () => {
      socket.off("joined", handleJoined);
    };
  }, [setIdContextRoomId, navigate]);

  console.log(room.id);

  if (!room.id) {
    const dynamiceRoomId = roomId.toString();
    console.log(
      "dynamiceRoomId",
      dynamiceRoomId,
      "typeof dynamiceRoomId",
      typeof dynamiceRoomId
    );
    if (dynamiceRoomId) socket.emit("join_room", dynamiceRoomId);
    return null;
  }

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
