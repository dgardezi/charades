const rooms = new Map(); // roomName: [userId]
const users = new Map(); // userId: {userName, roomName}

var _id = 0;

const _formatUser = (userId) => {
  let obj = {};
  obj["userId"] = userId;
  obj["userName"] = users.get(userId).userName;
  return obj;
};

function _makeRoomCode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const addUserToRoom = (name, room) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  console.log(rooms);
  console.log(room);

  if (rooms.has(room)) {
    const roomUsers = rooms.get(room);
    const userNames = roomUsers.map((userId) => users.get(userId).userName);
    if (userNames.includes(name)) {
      return { status: 2, message: "Username already taken" };
    } else {
      rooms.get(room).push(_id);
      users.set(_id, { userName: name, roomName: room });
      _id++;

      return { status: 0, message: "Success" };
    }
  } else {
    return { status: 1, message: "Room does not exist" };
  }
};

const removeUserFromRoom = (id, room) => {
  room = room.trim().toLowerCase();

  if (rooms.has(room)) {
    const index = rooms.get(room).findIndex((userId) => userId === id);
    if (index > -1) {
      rooms.get(room).splice(index, 1);
      users.delete(id);
      return { status: 0, message: "Success" };
    } else {
      return { status: 2, message: "User does not exist in room" };
    }
  } else {
    return { status: 1, message: "Room does not exist" };
  }
};

const getUsersFromRoom = (roomName) => {
  if (rooms.has(roomName)) {
    return rooms.get(roomName).map(_formatUser);
  } else {
    return null;
  }
};

const getUser = (userId) => {
  if (users.has(userId)) {
    return users.get(userId);
  } else {
    return null;
  }
};

// const getRooms = () => {

// };

const createRoom = () => {
  var roomCode = _makeRoomCode(4);
  while (rooms.has(roomCode)) {
    console.log("Stuck");
    roomCode = _makeRoomCode(4);
  }
  rooms.set(roomCode.toLowerCase(), new Array());
  return roomCode;
};

const closeRoom = (roomName) => {
  if (rooms.has(roomName)) {
    // Remove all users in roomName
    const roomUsers = rooms.get(roomName);
    roomUsers.forEach((userId) => users.delete(userId));

    // Remove roomName from rooms
    rooms.delete(roomName);
    return { status: 0, message: "Success" };
  } else {
    return { status: 1, message: "Room does not exist" };
  }
};

module.exports = {
  addUserToRoom,
  createRoom,
  removeUserFromRoom,
  getUsersFromRoom,
  getUser,
  closeRoom,
};
