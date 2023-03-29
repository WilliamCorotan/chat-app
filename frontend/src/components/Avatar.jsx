import React from "react";

export const Avatar = ({ userId, username, online }) => {
  const colors = [
    "bg-rose-200",
    "bg-teal-200",
    "bg-amber-200",
    "bg-cyan-200",
    "bg-purple-200",
    "bg-fuchsia-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const color = colors[userIdBase10 % colors.length];

  return (
    <div
      className={`w-8 h-8 relative ${color} rounded-full grid place-items-center`}
    >
      <span className="text-slate-600 opacity-90 capitalize">
        {username[0]}
      </span>
      {online ? (
        <div
          className={`absolute w-3 h-3 bg-green-600 bottom-0 right-0 rounded-full border`}
        ></div>
      ) : (
        <div
          className={`absolute w-3 h-3 bg-gray-600 bottom-0 right-0 rounded-full border ${`border-${color}`}`}
        ></div>
      )}
    </div>
  );
};
