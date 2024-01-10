import { useState, useEffect } from "react";
import { socket } from "../../../common/lib/socket";
import UserMouse from "./UserMouse";
import { useUserIds } from "../../../common/context/Users";

const MouseRenderer = () => {
  const userIds = useUserIds();
  return (
    <>
      {userIds.map((userId) => (
        <>
          <UserMouse key={userId} userId={userId} />
        </>
      ))}
    </>
  );
};

export default MouseRenderer;
