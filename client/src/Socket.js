import io from "socket.io-client";
export const endpoint = "localhost:3001";
export const socket = io(endpoint);
