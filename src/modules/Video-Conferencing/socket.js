import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"], // optional but recommended
});

export default socket;
