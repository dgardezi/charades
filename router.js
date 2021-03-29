const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());
const config = require("./config");

const {
  addUserToRoom,
  createRoom,
  removeUserFromRoom,
  getUsersFromRoom,
  getUser,
  closeRoom,
} = require("./rooms");

// router.get("/", (req, res) => {
//   res.send({ response: "server running" }).status(200);
// });

module.exports = router;
