// providers/SocketProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  onlineUsers: number[];
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({
  userId,
  children,
}: {
  userId: number;
  children: ReactNode;
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  useEffect(() => {
    if (!userId) return;

    const socket = io("https://chat-back-ymlq.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    console.log("Socket connected, emitting add-user:", userId);
    socket.emit("add-user", userId);

    socket.on("online-users", (users: number[]) => {
      console.log("Received online users:", users);
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
