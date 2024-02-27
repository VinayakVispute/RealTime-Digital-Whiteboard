import { useEffect, useState } from "react";
import { socket } from "../../../common/lib/socket";
import { useNavigate } from "react-router-dom";
import { useSetRoomId } from "../../../common/recoil/room";
// import { useRoomIdContext } from "../../../common/context/RoomId";
const Home = () => {
  const setAtomRoomId = useSetRoomId();
  // const { setIdContextRoomId } = useRoomIdContext();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    socket.emit("leave_room");
    setRoomId("");
  };

  useEffect(() => {
    const handleCreated = (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      navigate(`/room/${roomIdFromServer}`);
    };

    const handleJoined = (roomIdFromServer, failed) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        return navigate(`/room/${roomIdFromServer}`);
      } else {
        alert("Failed to join room");
      }
    };

    // Attach event listeners
    socket.on("created", handleCreated);
    socket.on("joined", handleJoined);

    // Cleanup event listeners when the component unmounts
    return () => {
      socket.off("created", handleCreated);
      socket.off("joined", handleJoined);
    };
  }, [navigate, setAtomRoomId, roomId]);

  useEffect(() => {
    setAtomRoomId();
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <div className="flex flex-col items-center py-24">
      <h1 className="text-5xl font-extrabold leading-tight sm:text-extra">
        Digiboard
      </h1>
      <h3 className="text-xl sm:text-2xl">Real-time whiteboard</h3>

      <div className="mt-10 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name
        </label>
        <input
          className="input"
          id="room-id"
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value.slice(0, 15))}
        />
      </div>

      <div className="my-8 h-px w-96 bg-zinc-200" />

      <form
        className="flex flex-col items-center gap-3"
        onSubmit={handleJoinRoom}
      >
        <label htmlFor="room-id" className="self-start font-bold leading-tight">
          Enter room id
        </label>
        <input
          className="input"
          id="room-id"
          placeholder="Room id..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn" type="submit">
          Join
        </button>
      </form>

      <div className="my-8 flex w-96 items-center gap-2">
        <div className="h-px w-full bg-zinc-200" />
        <p className="text-zinc-400">or</p>
        <div className="h-px w-full bg-zinc-200" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h5 className="self-start font-bold leading-tight">Create new room</h5>

        <button className="btn" onClick={handleCreateRoom}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
