const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./router/userRoutes");
const roomRouter = require("./router/roomRoutes");
// const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/room", roomRouter);
app.all("*", (req, res, next) =>
  res.status(404).json({ status: "fail", message: "Route Not Found" })
);

module.exports = app;
