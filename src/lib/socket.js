
import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  if (!userId) return;

  if (!socket) {
    const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    socket = io(SOCKET_URL, {
      query: { userId },
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: false
    });
  }

  if (!socket.connected) socket.connect();
  return socket;
};

export const getSocket = () => socket;
