const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.route("/signup").post(userController.register);
router.route("/login").post(userController.login);
router.route("/token").get(userController.getUserByToken);
module.exports = router;
