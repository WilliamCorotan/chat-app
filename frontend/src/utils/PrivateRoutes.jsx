import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const PrivateRoutes = () => {
  const { username } = useContext(UserContext);
  console.log(username);
  return username ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
