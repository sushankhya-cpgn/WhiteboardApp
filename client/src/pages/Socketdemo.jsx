// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:4000");

// function Socketdemo() {
//   const [message, setMessage] = useState("");
//   function sendMessage() {
//     console.log("Button Clicked");
//     socket.emit("send_message", { message: "Hello from client" });
//   }
//   useEffect(() => {
//     socket.on("receive_message", (data) => {});
//   }, [socket]);
//   return (
//     <div>
//       <button className=" bg-gray-500" onClick={sendMessage}>
//         Send Message
//       </button>
//     </div>
//   );
// }

// export default Socketdemo;
