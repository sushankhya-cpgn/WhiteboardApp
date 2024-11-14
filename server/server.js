const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { WebSocket, WebSocketServer } = require("ws");

dotenv.config({ path: "./config.env" });

const wss = new WebSocketServer({ port: 8080 });

// let senderSocket = null;
// let receiverSocket = null;
const rooms = [];

let senderSocket = null;
let receiverSocket = null;

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const message = JSON.parse(data);
    if (message.type === "sender") {
      senderSocket = ws;
    } else if (message.type === "receiver") {
      receiverSocket = ws;
    } else if (message.type === "createOffer") {
      console.log("createOffer Received");
      if (ws !== senderSocket) {
        return;
      }
      receiverSocket?.send(
        JSON.stringify({ type: "createOffer", sdp: message.sdp })
      );
    } else if (message.type === "createAnswer") {
      console.log("createAnswer Received");
      if (receiverSocket === ws) {
        return;
      }
      senderSocket?.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    } else if (message.type === "iceCandidate") {
      console.log("ice candidate received from sender");
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: message.candidate,
          })
        );
      } else if (ws === receiverSocket) {
        console.log("ice candidate received from receiver");
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
