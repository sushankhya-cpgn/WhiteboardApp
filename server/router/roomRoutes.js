const express = require("express");
const roomController = require("../controller/roomController");
const router = express.Router();

router.route("/createroom").post(roomController.saveRoomid);

router.route("/joinroom").post(roomController.checkRoomid);

module.exports = router;
