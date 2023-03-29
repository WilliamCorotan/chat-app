import React from "react";

export const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className=" w-1/3"></div>
      <div className="bg-teal-200 w-2/3 flex flex-col p-2">
        <div className="flex-grow">message goes here</div>
        <div className="flex gap-2">
          <input
            type="text"
            className="bg-white flex-grow border py-2 px-3 rounded-full"
            name="message"
            id="message"
            placeholder="Type your message here"
          />
          <button className="text-teal-600 py-2 px-3  rounded-sm ">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
