import { useEffect, useState } from "react";
import { useRoomIdContext } from "../../../common/context/RoomId";
import { socket } from "../../../common/lib/socket";
import { useNavigate, useParams } from "react-router-dom";
const NameInput = () => {
  const { setIdContextRoomId } = useRoomIdContext();
  const [name, setName] = useState("");
  const { roomId } = useParams();
  const formattedRoomId = roomId ? roomId.toString() : "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) return null;

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      console.log("room_exists", exists);
      if (!exists) {
        navigate("/");
      }
    });

    return () => {
      socket.off("room_exists");
    };
  }, [navigate, roomId]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer, failed) => {
      if (failed) navigate("/");
      else setIdContextRoomId(roomIdFromServer);
    };
    socket.on("joined", handleJoined);
    return () => {
      socket.off("joined", handleJoined);
    };
  }, [navigate, setIdContextRoomId]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join_room", formattedRoomId, name);
  };

  return (
    <form className="flex flex-col items-center" onSubmit={handleJoinRoom}>
      <h1 className="mt-24 text-extra font-extrabold leading-tight">
        Digiboard
      </h1>
      <h3 className="text-xl">Real-time whiteboard</h3>
      <div className="mt-10 mb-3 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="room-id"
          placeholder="Username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <button
        className="text-xl bg-black text-white transition-all hover:scale-105 active:scale-100 rounded-xl  p-5 py-1"
        type="submit"
        disabled={!name}
      >
        Enter the Room
      </button>
    </form>
  );
};

export default NameInput;