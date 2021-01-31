import io from "socket.io-client";
export const endpoint = "https://charades-me.herokuapp.com";
export const socket = io(endpoint);
