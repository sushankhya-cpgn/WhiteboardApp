import { useContext, useEffect, useRef, useState } from "react";
import { FaPen, FaEraser, FaShapes, FaUndo, FaRedo } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { Canvas } from "../components/Canvas";
import { SidebarOptions } from "../components/SidebarOptions";
import { Navbar } from "../components/Navbar";
import MessageBox from "../components/MessageBox";
import useFetch from "../utils/useFetch";
import UserContext from "../context/userContext";

function DrawingPage() {
  const [active, setActive] = useState(0); // Default to "Pen" tool
  const [color, setColor] = useState("#000000");
  const [undo, setUndo] = useState(false);
  const { user, login } = useContext(UserContext);
  const { response, loading } = useFetch();
  const [socket, setSocket] = useState(null);
  const [pc, setPc] = useState(null);
  const videoref = useRef(null);

  const getCameraStreamAndSend = (pc) => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoref.current) {
        videoref.current.srcObject = stream;
        videoref.current.play();
      }
      stream.getTracks().forEach((track) => {
        pc?.addTrack(track);
      });
    });
  };

  useEffect(() => {
    if (response) {
      console.log(response.data.data);
      login(response.data.data);
    } else {
      console.log("No response");
    }
  }, [response, login]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080/");
    setSocket(() => socket);
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
  }, []);
  useEffect(() => {
    async function initiateConn() {
      if (socket) {
        socket.onmessage = async (event) => {
          console.log("On message reached");
          const message = JSON.parse(event.data);
          if (message.type === "createAnswer") {
            if (!pc) {
              console.log("no pc");
              return;
            }
            console.log("create Answer REACHED");

            await pc.setRemoteDescription(message.sdp);
          } else if (message.type === "iceCandidate") {
            pc.addIceCandidate(message.candidate);
          }
        };
        const pc = new RTCPeerConnection();
        setPc(pc);
        pc.onnegotiationneeded = async () => {
          console.log("NEGOTIATION NEEDED");
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket?.send(
            JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
          );
        };
        pc.onicecandidate = (event) => {
          console.log("on ice reaccheds");
          if (event.candidate) {
            socket.send(
              JSON.stringify({
                type: "iceCandidate",
                candidate: event.candidate,
              })
            );
          }
        };
        getCameraStreamAndSend(pc);
      }
    }

    initiateConn();
  }, [socket]);

  if (loading) {
    return <p className="text-center">Loading....</p>;
  }

  const sidebarOptions = [
    { icon: <FaPen />, label: "Pen", toolId: 0 },
    { icon: <FaEraser />, label: "Eraser", toolId: 1 },
    { icon: <FaShapes />, label: "Shapes", toolId: 2 },
    { icon: <IoIosColorPalette />, label: "Color", toolId: 3 },
    { icon: <FaUndo />, label: "Undo", toolId: 4 },
    { icon: <FaRedo />, label: "Redo", toolId: 5 },
  ];
  function handleClick(el) {
    setActive(el);
    el === 4 ? setUndo(true) : setUndo(false);
  }

  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex h-full">
        {/* Sidebar */}
        <aside className="bg-white w-1/6 flex flex-col space-y-6 items-center py-8 shadow-lg">
          {sidebarOptions.map((option) => (
            <SidebarOptions
              icon={option.icon}
              label={option.label}
              isactive={active === option.toolId}
              handleClick={() => handleClick(option.toolId)}
              color={color}
              setColor={setColor}
              key={option.toolId}
            />
          ))}
        </aside>

        {/* Drawing Canvas */}
        <section className="flex-1 bg-gray-50 ">
          <Canvas activeTool={active} undo={undo}>
            {color}
          </Canvas>
          <MessageBox />
          <video ref={videoref} className=" h-40  absolute bottom-0 left-0" />

          {/* <button onClick={initiateConn}>Send Data</button> */}
        </section>
      </main>
    </div>
  );
}

export default DrawingPage;
