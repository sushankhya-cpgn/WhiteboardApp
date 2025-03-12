import { useContext, useEffect, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { Navbar } from "../components/Navbar";
import MessageBox from "../components/MessageBox";
import useFetch from "../utils/useFetch";
import UserContext from "../context/userContext";
import { useNavigate } from "react-router";
// import getCameraStreamAndSend from "../utils/getCameraStreamandSend";
import SideBar from "../components/SideBar";
import { useSocket } from "../context/SocketProvider";

function SenderPage() {
  // Default to "Pen" tool
  const [active, setActive] = useState(0);
  const [color, setColor] = useState("#000000");
  const [undo, setUndo] = useState(false);
  const { user, login } = useContext(UserContext);
  const { response, loading } = useFetch();
  // const [pc, setPc] = useState(null);
  const videoref = useRef(null);
  const receivervideoref = useRef(null);
  const navigate = useNavigate();

  const { socket, initiateConnection, createSenderSocket } = useSocket();

  console.log("sender socket", socket);
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    if (response) {
      console.log(response.data.data);
      login(response.data.data);
    } else {
      console.log("No response");
    }
  }, [response, login]);

  useEffect(() => {
    if (!socket) {
      createSenderSocket();
    }
  }, []);

  if (loading) {
    return <p className="text-center">Loading....</p>;
  }

  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex h-full">
        {/* Sidebar */}
        <SideBar
          active={active}
          setActive={setActive}
          color={color}
          setUndo={setUndo}
          setColor={setColor}
        />
        <button
          onClick={() => {
            initiateConnection(videoref, receivervideoref, user);
          }}
        >
          Send Data
        </button>

        {/* Drawing Canvas */}
        <section className="flex-1 bg-gray-50 ">
          <Canvas activeTool={active} undo={undo} socket={socket}>
            {color}
          </Canvas>
          <MessageBox socket={socket} user={user} />
          <video
            ref={receivervideoref}
            className=" h-40  absolute bottom-0 left-0"
          />
        </section>
      </main>
    </div>
  );
}

export default SenderPage;
