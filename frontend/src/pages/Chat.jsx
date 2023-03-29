import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";

import { uniqBy } from "lodash";
import { Logo } from "../components/Logo";
import { UserContext } from "../contexts/UserContext";
import { useRef } from "react";
import Contact from "../components/Contact";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [offlineUsers, setOfflineUsers] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const { id, username, setId, setUsername } = useContext(UserContext);
  const messageBoxEndRef = useRef();
  const navigate = useNavigate();
  const showOnline = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username, email }) => {
      people[userId] = { username: username, email: email };
    });
    setOnlineUsers(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);

    if ("online" in messageData) {
      showOnline(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      }),
    );

    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    setNewMessage("");
  };

  const logout = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
      navigate("/login");
    });
  };
  useEffect(() => {
    const div = messageBoxEndRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get(`/messages/${selectedUserId}`).then((res) => {
        setMessages([...res.data]);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlineUsers).includes(p._id));
      const offlineUsers = {};
      offlinePeopleArr.forEach((p) => {
        offlineUsers[p._id] = p;
      });
      setOfflineUsers(offlineUsers);
    });
  }, [onlineUsers]);
  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect.");
        connectToWs();
      }, 1000);
    });
  };
  useEffect(() => {
    connectToWs();
  }, []);

  const onlineUsersExcludeCurrent = { ...onlineUsers };
  delete onlineUsersExcludeCurrent[id];

  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className="h-screen flex flex-col">
      <div className="w-screen top-0 h-fit">
        {" "}
        <div className="p-2 text-center flex items-center justify-end">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <i className="fa-solid fa-user mr-1"></i> {username}
          </span>

          <button
            onClick={logout}
            className="text-sm bg-rose-200 py-1 px-2 text-gray-500 border rounded-sm"
          >
            logout
          </button>
        </div>
      </div>
      <div className="flex flex-grow">
        <div className=" w-1/3 py-2 ">
          <Logo />
          <div className="mt-4 border-t border-teal-600">
            <div className="border-b mb-4">
              <span className="text-xs text-slate-400 px-3 py-2">Online</span>
              {Object.keys(onlineUsersExcludeCurrent).map((userId) => {
                return (
                  <Contact
                    key={userId}
                    userId={userId}
                    online={true}
                    username={onlineUsersExcludeCurrent[userId].username}
                    setSelectedUserId={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId}
                  />
                );
              })}
            </div>
            <div className="border-b mb-4">
              <span className="text-xs text-slate-400 px-3 py-2">Offline</span>
              {Object.keys(offlineUsers).map((userId) => {
                return (
                  <Contact
                    key={userId}
                    userId={userId}
                    online={false}
                    username={offlineUsers[userId].username}
                    setSelectedUserId={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg-teal-200 w-2/3 flex flex-col p-2">
          {selectedUserId ? (
            <>
              <div
                className="flex-grow
            "
              >
                <div className="relative h-full">
                  <div className="overflow-y-auto absolute inset-0">
                    {messagesWithoutDupes.map((message) => (
                      <div
                        key={message._id}
                        className={`
                         ${message.sender === id ? "text-right" : "text-left"}
                      `}
                      >
                        <div
                          className={`text-left inline-block p-2 my-2 text-sm 
                      ${
                        message.sender === id
                          ? "bg-teal-700 text-white rounded-tl-lg rounded-bl-lg rounded-tr-lg"
                          : "bg-white text-slate-600 rounded-tl-lg rounded-br-lg rounded-tr-lg"
                      }
                    `}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                    <div className="h-2" ref={messageBoxEndRef}></div>
                  </div>
                </div>
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  className="bg-white flex-grow border py-2 px-3 rounded-full"
                  value={newMessage}
                  placeholder="Type your message here"
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                  }}
                />
                {newMessage && (
                  <button className="text-teal-600 py-2 px-3  rounded-sm ">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                )}
              </form>
            </>
          ) : (
            <>
              <div className="h-full grid place-items-center">
                <span className="text-2xl text-slate-600 opacity-90">
                  Select a conversation!
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
