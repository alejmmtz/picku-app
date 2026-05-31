/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { API_URL } from "../config/axiosConfig";
import { getStoredAuth, isStoredSessionValid } from "../utils/storage";
import type { OrderResponse } from "../types/order.types";

type OrderChangedHandler = (order: OrderResponse) => void;

type SocketContextValue = {
  getSocket: () => Socket | null;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const getSocket = useCallback(() => {
    const auth = getStoredAuth();

    if (!isStoredSessionValid(auth)) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return null;
    }

    if (!auth) {
      return null;
    }

    if (socketRef.current) {
      return socketRef.current;
    }

    socketRef.current = io(API_URL, {
      auth: {
        token: auth.session.access_token,
      },
      transports: ["websocket", "polling"],
    });

    return socketRef.current;
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={{ getSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return ctx;
};

export const useOrderRealtime = (handler: OrderChangedHandler) => {
  const { getSocket } = useSocket();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socket.on("orders:changed", handler);

    return () => {
      socket.off("orders:changed", handler);
    };
  }, [getSocket, handler]);
};
