import { useContext, createContext, useState } from "react";

const UsersContext = createContext();

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }
  return context;
};

export const UsersProvider = (props) => {
  const [users, UpdateUsers] = useState({});
  const usersIds = Object.keys(users);

  return (
    <UsersContext.Provider
      value={{ users, usersIds, UpdateUsers }}
      {...props}
    />
  );
};

export const useUserIds = () => {
  const { usersIds } = useUsersContext();
  return usersIds;
};

export const useUsers = () => {
  const { users } = useUsersContext();
  return users;
};
