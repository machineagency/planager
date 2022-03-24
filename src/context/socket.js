import socketio from "socket.io-client";
import React from "react";

export const socket = socketio.connect();
export const SocketContext = React.createContext();
