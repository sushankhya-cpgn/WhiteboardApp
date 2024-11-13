import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserContext from "../context/userContext";

export function Navbar() {
  const { user } = useContext(UserContext);
  function EndMeeting() {
    window.location.replace("/");
  }
  return (
    <header className="bg-white shadow-md flex items-center h-16 w-full justify-between px-4">
      <div className="flex items-center space-x-8">
        <h1 className="text-lg text-black font-semibold">WhiteBoard App</h1>
        <div className="flex space-x-8 text-gray-500">
          <span className="hover:underline cursor-pointer">Share</span>
          <span className="hover:underline cursor-pointer">Export</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800"
          onClick={EndMeeting}
        >
          End Meeting
        </button>
        <div className=" flex flex-row">
          <FaUserCircle className="text-gray-600 text-3xl" />
          <p className="ml-2">{user?.name}</p>
        </div>
      </div>
    </header>
  );
}
