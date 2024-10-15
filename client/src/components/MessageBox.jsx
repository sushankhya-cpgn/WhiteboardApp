import { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:4000");

function MessageBox() {
  const [msgboxclick, setMsgboxclick] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [receivedMsg, setReceivedMsg] = useState([]);

  function handleSendMessage() {
    if (userMessage.trim() !== "") {
      socket.emit("send_message", { message: userMessage });
      setUserMessage("");
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMsg((prevmsg) => [...prevmsg, data.message]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);
  const togglemsgbox = () => {
    setMsgboxclick((prev) => !prev);
  };

  return (
    <>
      {!msgboxclick ? (
        <div
          className="fixed bottom-3 right-6 h-10 w-64 text-white bg-[#2663FF] bg-opacity-89 rounded flex flex-row items-center justify-center shadow-md p-2 cursor-pointer hover:opacity-95"
          onClick={togglemsgbox}
        >
          <div className="text-md">Messages</div>
          <div className="absolute right-3">
            <FaAngleUp color="black" className="text-2xl" />
          </div>
        </div>
      ) : (
        <div className="h-4/6 w-1/5 fixed bottom-3 right-6 bg-slate-200 rounded-lg text-lg">
          <div className="bg-[#2663FF] h-10 w-full items-center text-white text-center flex flex-row justify-center text-md rounded-l-lg rounded-r-lg rounded-b-none">
            Messages
            <IoMdClose
              onClick={togglemsgbox}
              className="bg-[#2663FF] text-white absolute right-3 cursor-pointer"
            />
          </div>
          <div className="ml-3 overflow-auto  h-4/5 flex flex-col ">
            {receivedMsg.map((msg, index) => (
              <div key={index} className="bg-white p-3 my-1 rounded shadow-md">
                <span>{msg}</span>
              </div>
            ))}
          </div>

          <form
            className="h-10 bg-white  w-10/12 opacity-100 text-black flex flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Enter message to Send"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-md"
            />
            <button
              type="submit"
              className="bg-[#2663FF] text-white px-4 rounded-r-md"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default MessageBox;
