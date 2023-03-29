import { Avatar } from "../components/Avatar";
const Contact = ({ userId, username, setSelectedUserId, selected, online }) => {
  return (
    <>
      <div
        className={`border-b border-gray-200 py-4 px-3 flex items-center gap-2 ${
          selected ? `bg-teal-200 border-l-4 border-teal-700` : ``
        }`}
        onClick={setSelectedUserId}
      >
        <Avatar online={online} username={username} userId={userId} />
        <span className="text-slate-600">{username}</span>
      </div>
    </>
  );
};

export default Contact;
