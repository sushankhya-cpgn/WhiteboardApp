import { useEffect, useState, createContext, useContext } from "react";
import getCameraStreamAndSend from "../utils/getCameraStreamandSend";
const SocketContext = createContext(undefined);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [receivedMsg, setReceivedMsg] = useState([]);
  const [senderPc, setSenderPc] = useState(null);
  const [receiverPC, setReceiverPC] = useState(null);
  const [receivedpath, setReceivedpath] = useState([]);

  const createSenderSocket = function () {
    const socket = new WebSocket("ws://localhost:8080");
    // socketRef.current = socket;
    socket.onopen = () => {
      socket?.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
    setSocket(socket);
  };

  const createReceiverSocket = function () {
    const socket = new WebSocket("ws://localhost:8080");
    // socketRef.current = socket;
    socket.onopen = () => {
      socket?.send(
        JSON.stringify({
          type: "receiver",
        })
      );
    };
    setSocket(socket);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = async (event) => {
      console.log("On message reached");
      const message = JSON.parse(event.data);

      if (message.type === "createOffer") {
        receiverPC.setRemoteDescription(message.sdp).then(() => {
          receiverPC.createAnswer().then((answer) => {
            receiverPC.setLocalDescription(answer);
            socket?.send(
              JSON.stringify({
                type: "createAnswer",
                sdp: answer,
              })
            );
          });
        });
      } else if (message.type === "iceCandidate") {
        if (senderPc) {
          senderPc.addIceCandidate(message.candidate);
        } else if (receiverPC) {
          receiverPC.addIceCandidate(message.candidate);
        }
      } else if (message.type === "receiverReady") {
        console.log("Receiver is ready, proceeding with connection.");
        console.log("sender pc", senderPc);
        senderPc.onnegotiationneeded();
      } else if (message.type === "createAnswer") {
        if (!senderPc) {
          console.log("no pc");
          return;
        }
        console.log("create Answer REACHED");
        await senderPc.setRemoteDescription(message.sdp);
      } else if (message.type === "txt") {
        setReceivedMsg([...receivedMsg, message.user + message.message]);
        console.log(`message received from ${message.user}`, message.message);
      } else if (message.type === "drawingdata") {
        console.log("drawingdata received");
        setReceivedpath((prev) => [...prev, ...message.data]);
      }
    };
  }, [senderPc, receiverPC, socket, receivedMsg]);

  //   function startReceiving(){
  //     const pc = new RTCPeerConnection();

  //     pc.ontrack = (event) => {
  //       videoRef.current.srcObject = new MediaStream([event.track]);
  //       videoRef.current.muted = true;
  //       videoRef.current.play();
  //     };
  //   }

  async function initiateConnection(videoref, receivervideoref, user) {
    console.log("send clicked");
    const pc = new RTCPeerConnection();

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
    setSenderPc(pc);
  }

  async function startReceiving(videoRef, receivervideoref) {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      videoRef.current.srcObject = new MediaStream([event.track]);
      videoRef.current.muted = true;
      videoRef.current.play();
    };
    getCameraStreamAndSend(pc, receivervideoref);
    setReceiverPC(pc);
  }

  //   useEffect(() => {
  //     if (!socket) return;
  //     socket.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       if (message.type === "createOffer") {
  //         pc.setRemoteDescription(message.sdp).then(() => {
  //           pc.createAnswer().then((answer) => {
  //             pc.setLocalDescription(answer);
  //             socket?.send(
  //               JSON.stringify({
  //                 type: "createAnswer",
  //                 sdp: answer,
  //               })
  //             );
  //           });
  //         });
  //       } else if (message.type === "iceCandidate") {
  //         pc.addIceCandidate(message.candidate);
  //       }
  //     };
  //   });

  return (
    <SocketContext.Provider
      value={{
        socket,
        receivedMsg,
        createSenderSocket,
        createReceiverSocket,
        initiateConnection,
        receivedpath,
        startReceiving,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

function useSocket() {
  const socket = useContext(SocketContext);
  if (socket === undefined) throw new Error("socket context used outside");
  return socket;
}

export { SocketContextProvider, useSocket };
