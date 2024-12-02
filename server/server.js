const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { WebSocket, WebSocketServer } = require("ws");

dotenv.config({ path: "./config.env" });

const wss = new WebSocketServer({ port: 8080 });
const rooms = [];
let senderSocket = null;
let receiverSocket = null;

wss.on("connection", function connection(ws) {
  console.log("New WebSocket connection established.");

  ws.on("error", (error) => {
    console.error("WebSocket Error:", error);
  });

  ws.on("message", function message(data) {
    try {
      const message = JSON.parse(data);
      console.log("Message received:", data);

      if (message.type === "sender") {
        senderSocket = ws;
        console.log("Sender socket registered.");
      } else if (message.type === "receiver") {
        receiverSocket = ws;
        console.log("Receiver socket registered.");
      } else if (message.type === "senderDrawingdata") {
        console.log(" path is", message.path);
        receiverSocket?.send(
          JSON.stringify({ type: "drawingdata", data: message.path })
        );
      } else if (message.type === "createOffer") {
        console.log("createOffer Received:", message.sdp);

        if (ws !== senderSocket) {
          console.warn("Unauthorized sender for createOffer.");
          return;
        }
        receiverSocket?.send(
          JSON.stringify({ type: "createOffer", sdp: message.sdp })
        );
        console.log("Offer forwarded to receiver.");
      } else if (message.type === "createAnswer") {
        console.log("createAnswer Received:", message.sdp);
        if (ws !== receiverSocket) {
          console.warn("Unauthorized sender for createAnswer.");
          return;
        }
        senderSocket?.send(
          JSON.stringify({ type: "createAnswer", sdp: message.sdp })
        );
        console.log("Answer forwarded to sender.");
      } else if (message.type === "iceCandidate") {
        console.log("ICE Candidate received:", message.candidate);
        if (ws === senderSocket) {
          console.log("Forwarding ICE Candidate to receiver.");
          receiverSocket?.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: message.candidate,
            })
          );
        } else if (ws === receiverSocket) {
          console.log("Forwarding ICE Candidate to sender.");
          senderSocket?.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: message.candidate,
            })
          );
        } else {
          console.warn("Unrecognized ICE Candidate source.");
        }
      } else {
        console.warn("Unrecognized message type:", message.type);
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

console.log("Connecting to the database...");
mongoose
  .connect(DB)
  .then(() => console.log("Database connection successful."))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 8000;

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
