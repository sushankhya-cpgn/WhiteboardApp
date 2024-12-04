import { useContext, useEffect, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { Navbar } from "../components/Navbar";
import MessageBox from "../components/MessageBox";
import useFetch from "../utils/useFetch";
import UserContext from "../context/userContext";
import { useNavigate } from "react-router";
import getCameraStreamAndSend from "../utils/getCameraStreamandSend";
import SideBar from "../components/SideBar";

function SenderPage() {
  // Default to "Pen" tool
  const [active, setActive] = useState(0);
  const [color, setColor] = useState("#000000");
  const [undo, setUndo] = useState(false);
  const { user, login } = useContext(UserContext);
  const { response, loading } = useFetch();
  const [socket, setSocket] = useState(null);
  const [pc, setPc] = useState(null);
  const [txtmsg, setTxtmsg] = useState("");
  const videoref = useRef(null);
  const receivervideoref = useRef(null);
  const navigate = useNavigate();

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
    const socket = new WebSocket("ws://127.0.0.1:8080");
    setSocket(() => socket);
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
  }, []);

  if (loading) {
    return <p className="text-center">Loading....</p>;
  }
  async function initiateConn() {
    if (!socket) {
      return;
    }
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

    pc.onicecandidate = (event) => {
      console.log("on ice reaccheds");
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: event.candidate,
          })
        );
      }
    };
    pc.onnegotiationneeded = async () => {
      console.log("NEGOTIATION NEEDED");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
      );
    };
    user && getCameraStreamAndSend(pc, videoref);
    pc.ontrack = (event) => {
      receivervideoref.current.srcObject = new MediaStream([event.track]);
      receivervideoref.current.muted = true;
      receivervideoref.current.play();
    };
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
          <MessageBox socket={socket} />
          <video
            ref={receivervideoref}
            className=" h-40  absolute bottom-0 left-0"
          />

          <button onClick={initiateConn}>Send Data</button>
        </section>
      </main>
    </div>
  );
}

export default SenderPage;
