const rooms = new Map(); // roomName: [userId]
const users = new Map(); // userId: {userName, roomName}

const formatUser = (userId) => {
  let obj = {};
  obj["userId"] = userId;
  obj["userName"] = users.get(userId).userName;
  return obj;
};

const addUserToRoom = (id, name, room) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (rooms.has(room)) {
    const roomUsers = rooms.get(room);
    const userNames = roomUsers.map((userId) => users.get(userId).userName);
    if (userNames.includes(name)) {
      return { status: 2, message: "Username already taken" };
    } else {
      rooms.get(room).push(id);
      users.set(id, { userName: name, roomName: room });

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
    return rooms.get(roomName).map(formatUser);
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

const createRoom = (roomName) => {
  roomName = roomName.trim().toLowerCase();

  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Array());
    return { status: 0, message: "Success" };
  } else {
    return { status: 1, message: "Room already exists" };
  }
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
