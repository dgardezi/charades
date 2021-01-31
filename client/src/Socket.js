import io from "socket.io-client";
export const endpoint = "http://localhost:3001";
export const socket = io(endpoint);
