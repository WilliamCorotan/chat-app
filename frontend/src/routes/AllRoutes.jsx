import React from "react";
import { Route, Routes } from "react-router-dom";
import { Chat } from "../pages/Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../utils/ErrorPage";
import PrivateRoutes from "../utils/PrivateRoutes";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Chat />} path="/" />
        </Route>
        <Route path="/login" index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default AllRoutes;
