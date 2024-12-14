import { useContext, useEffect, useRef, useState } from "react";
import getCameraStreamAndSend from "../utils/getCameraStreamandSend";
import MessageBox from "../components/MessageBox";
import { Canvas } from "../components/Canvas";
import SideBar from "../components/SideBar";
import { Navbar } from "../components/Navbar";
import UserContext from "../context/userContext";
import { useNavigate } from "react-router";
import useFetch from "../utils/useFetch";

export const Receiver = () => {
  const [active, setActive] = useState(0);
  const [color, setColor] = useState("#000000");
  const [undo, setUndo] = useState(false);
  const [socket, setSocket] = useState(null);
  const { user, login } = useContext(UserContext);
  const videoRef = useRef(null);
  const receivervideoref = useRef(null);
  const navigate = useNavigate();
  const { response, loading } = useFetch();

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
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(() => socket);
    // socketRef.current = socket;
    socket.onopen = () => {
      socket?.send(
        JSON.stringify({
          type: "receiver",
        })
      );
    };
    startReceiving(socket);

    return () => {
      socket.close();
    };
  }, []);

  function startReceiving(socket) {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      videoRef.current.srcObject = new MediaStream([event.track]);
      videoRef.current.muted = true;
      videoRef.current.play();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        pc.setRemoteDescription(message.sdp).then(() => {
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            socket?.send(
              JSON.stringify({
                type: "createAnswer",
                sdp: answer,
              })
            );
          });
        });
      } else if (message.type === "iceCandidate") {
        pc.addIceCandidate(message.candidate);
      }
    };
    getCameraStreamAndSend(pc, receivervideoref);
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

        {/* Drawing Canvas */}
        <section className="flex-1 bg-gray-50 ">
          <Canvas activeTool={active} undo={undo} socket={socket}>
            {color}
          </Canvas>
          <MessageBox socket={socket} user={user} />
          <video
            ref={videoRef}
            className=" h-40  absolute bottom-0 left-0"
            muted={true}
            autoPlay
          />
        </section>
      </main>
    </div>
  );
};

export default Receiver;
