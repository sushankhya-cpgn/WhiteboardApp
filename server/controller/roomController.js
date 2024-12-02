const Room = require("../model/roomModel");

exports.saveRoomid = async function saveroom(req, res) {
  try {
    const roomid = req.body.roomid;
    const query = await Room.create({
      roomid,
    });
    return res.status(200).json({ status: "success", message: "Room Created" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "failed", message: err });
  }
};

exports.checkRoomid = async function getRoom(req, res) {
  try {
    const roomid = req.roomid;
    const query = await Room.findOne({ roomid });
    res.status(200).json({
      status: "success",
      message: query,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};
