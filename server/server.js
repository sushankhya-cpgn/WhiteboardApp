const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { WebSocket, WebSocketServer } = require("ws");
// const http = require("http");
// const { Server } = require("socket.io");

dotenv.config({ path: "./config.env" });

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User connected with user Id ${socket.id}`);
//   socket.on("send_message", (data) => {
//     io.sockets.emit("receive_message", data);
//   });
// });

const wss = new WebSocketServer({ port: 8080 });

// let senderSocket = null;
// let receiverSocket = null;
const rooms = [];

let senderSocket = null;
let receiverSocket = [];

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const message = JSON.parse(data);
    if (message.type === "sender") {
      senderSocket = ws;
    } else if (message.type === "receiver") {
      // receiverSocket = ws;
      receiverSocket.push(ws);
    } else if (message.type === "createOffer") {
      if (ws !== senderSocket) {
        return;
      }
      receiverSocket.forEach((r) => {
        r.send(JSON.stringify({ type: "createOffer", sdp: message.sdp }));
      });
    } else if (message.type === "createAnswer") {
      if (!receiverSocket.includes(ws)) {
        return;
      }
      senderSocket?.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    } else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        receiverSocket.forEach((r) => {
          r.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: message.candidate,
            })
          );
        });
      } else if (receiverSocket.includes(ws)) {
        senderSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      }
    } else if (message.type === "createRoom") {
      const room = Date.now();
      rooms[room] = [];
    } else if (message.type === "joinRoom") {
      const room_to_join = message.room;
      if (!rooms.includes(message.room)) {
        return;
      }
      rooms[message.room].push(ws);
    }
  });
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB)
  .then((con) => {})
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(4000, () => {
  console.log("listening on *:4000");
});
