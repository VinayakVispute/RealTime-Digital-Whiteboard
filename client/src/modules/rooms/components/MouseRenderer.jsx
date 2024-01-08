import { useState, useEffect } from "react";
import { socket } from "../../../common/lib/socket";
import SocketMouse from "./SocketMouse";
import { useUserIds } from "../../../common/context/Users";

const MouseRenderer = () => {
  const userIds = useUserIds();
  console.log("MouseRenderer", userIds);
  return (
    <>
      {userIds.map((userId) => (
        <>
          <SocketMouse key={userId} userId={userId} />
        </>
      ))}
    </>
  );
};

export default MouseRenderer;
