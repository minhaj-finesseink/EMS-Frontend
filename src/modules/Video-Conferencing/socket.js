import io from "socket.io-client";

const socket = io(import.meta.env.VITE_FRONTEND_URL); // WebSocket connection
// const socket = io("https://ems-backend-c517.onrender.com"); // WebSocket connection

export default socket;
