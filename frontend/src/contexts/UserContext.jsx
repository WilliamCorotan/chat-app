import axios from "axios";
import { useState, useEffect } from "react";
import { createContext } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get("/profile").then((res) => {
      setId(res.data.userId);
      setUsername(res.data.username);
      setEmail(res.data.email);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, id, setId, email, setEmail }}
    >
      {children}
    </UserContext.Provider>
  );
}
