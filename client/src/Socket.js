import io from "socket.io-client";
export const endpoint = "https://charades1.herokuapp.com";
export const socket = io(endpoint);
