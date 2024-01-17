import { socket } from "../../../../common/lib/socket";
import UserMouse from "./UserMouse";
import { useRoom } from "../../../../common/context/RoomId";
import { Fragment } from "react";

const MouseRenderer = () => {
  const room = useRoom();
  const { users } = useRoom();

  return (
    <>
      {[...users.keys()].map((userId) => (
        <Fragment key={userId}>
          {userId === socket.id ? null : (
            <UserMouse key={userId} userId={userId} />
          )}
        </Fragment>
      ))}
    </>
  );
};

export default MouseRenderer;
