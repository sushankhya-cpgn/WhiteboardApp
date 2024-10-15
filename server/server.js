const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config({ path: "./config.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected with user Id ${socket.id}`);
  socket.on("send_message", (data) => {
    io.sockets.emit("receive_message", data);
  });
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB)
  .then((con) => {
    console.log(con.connection);
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

server.listen(4000, () => {
  console.log("listening on *:4000");
});
