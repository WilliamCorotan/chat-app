import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const navigate = useNavigate();
  console.log();

  const login = async (e) => {
    e.preventDefault();
    await axios
      .post("/login", {
        username,
        password,
      })
      .then((res) => {
        console.log(res.data);
        const error = res.data.error;
        if (error) {
          setErrorMessage(error);
        } else {
          setLoggedInUsername(username);
          setId(res.data.id);
          sessionStorage.setItem("loggedIn", true);
          navigate("/");
        }
      });
  };
  return (
    <div className="mx-auto w-screen h-screen grid place-items-center bg-gradient-to-tl from-green-400 to-cyan-500">
      <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-none p-8">
        <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-teal-gray-900 antialiased">
          Login to Chat-App
        </h4>
        <p className="mt-1 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
          Enter your details to login.
        </p>
        {errorMessage && (
          <p className="mt-1 block font-sans text-sm font-normal leading-relaxed text-red-600 antialiased">
            {errorMessage}
          </p>
        )}
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={login}
          method="post"
        >
          <div className="mb-4 flex flex-col gap-6">
            {/* Username Field */}
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                className="peer h-full w-full rounded-md border border-teal-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-teal-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-teal-gray-200 placeholder-shown:border-t-teal-gray-200 focus:border-2 focus:border-teal-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-teal-gray-50"
                placeholder=" "
                value={username}
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-teal-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-teal-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-teal-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-teal-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-teal-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-teal-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-teal-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-teal-gray-500">
                Username
              </label>
            </div>

            {/* Password Field */}
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                className="peer h-full w-full rounded-md border border-teal-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-teal-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-teal-gray-200 placeholder-shown:border-t-teal-gray-200 focus:border-2 focus:border-teal-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-teal-gray-50"
                placeholder=" "
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-teal-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-teal-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-teal-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-teal-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-teal-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-teal-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-teal-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-teal-gray-500">
                Password
              </label>
            </div>
          </div>

          <button
            className="mt-6 block w-full select-none rounded-lg bg-teal-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-500/20 transition-all hover:shadow-lg hover:shadow-teal-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
          >
            Login
          </button>
          <p className="mt-4 block text-center font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
            Dont have an account?{" "}
            <Link
              className="font-medium text-teal-500 transition-colors hover:text-teal-700"
              to="/register"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
