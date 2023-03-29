import { useContext } from "react";
import Register from "../pages/Register";

import { UserContext } from "../contexts/UserContext";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return "logged in " + username;
  }
  return <Register />;
};

export default Routes;
