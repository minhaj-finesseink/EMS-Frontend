import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // WebSocket connection
const socket = io("https://ems-backend-c517.onrender.com"); // WebSocket connection

export default socket;
