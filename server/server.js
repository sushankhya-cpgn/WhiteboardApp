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
        senderSocket?.send(JSON.stringify({ type: "receiverReady" }));
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
        if (message.type === "iceCandidate") {
          if (ws === senderSocket) {
            receiverSocket?.send(
              JSON.stringify({
                type: "iceCandidate",
                candidate: message.candidate,
              })
            );
          } else if (ws === receiverSocket) {
            senderSocket?.send(
              JSON.stringify({
                type: "iceCandidate",
                candidate: message.candidate,
              })
            );
          }
        }
      } else if (message.type === "senderDrawingdata") {
        console.log("received");
        console.log(message.data);
        receiverSocket?.send(
          JSON.stringify({ type: "drawingdata", data: message.data })
        );
      } else if (message.type === "textmessage") {
        console.log(message.message);
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: "txt",
              message: message.message,
              user: message.user,
            })
          );
        });
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    if (ws === senderSocket) senderSocket = null;
    if (ws === receiverSocket) receiverSocket = null;
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
