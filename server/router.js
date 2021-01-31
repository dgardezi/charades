const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());
const config = require("./config");
const { videoToken } = require("./tokens");

const {
  addUserToRoom,
  createRoom,
  removeUserFromRoom,
  getUsersFromRoom,
  getUser,
  closeRoom,
} = require("./rooms");

router.get("/", (req, res) => {
  console.log(req);
  res.send({ response: "server running" }).status(200);
});

router.post("/joinRoom", (req, res) => {
  const { name, room } = req.body;
  const response = addUserToRoom(name, room);

  const token = videoToken(name, room, config);
  res.send({ response, token: token.toJwt() }).status(200);
});

router.post("/createRoom", (req, res) => {
  const { name } = req.body;
  console.log(`${name} tried to make a new room`);

  const room = createRoom();
  const response = addUserToRoom(name, room);

  console.log(config);
  const token = videoToken(name, room, config);
  res.send({ response, room, token: token.toJwt() }).status(200);
});

module.exports = router;
