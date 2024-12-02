const mongoose = require("mongoose");

const roomModel = new mongoose.Schema({
  roomid: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("roomModel", roomModel);
