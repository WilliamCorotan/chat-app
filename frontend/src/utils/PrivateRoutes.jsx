import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const PrivateRoutes = () => {
  const loggedIn = sessionStorage.getItem("loggedIn");
  let token;
  const tokenCookieString = document.cookie
    .split(";")
    .find((str) => str.startsWith("token="));
  if (tokenCookieString) {
    token = tokenCookieString.split("=")[1];
  }
  console.log(token);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
