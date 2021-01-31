const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());

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
  res.send({ response }).status(200);
});

router.post("/createRoom", (req, res) => {
  const { name } = req.body;
  console.log(`${name} tried to make a new room`);

  const room = createRoom();
  const response = addUserToRoom(name, room);

  res.send({ response, room }).status(200);
});

module.exports = router;
