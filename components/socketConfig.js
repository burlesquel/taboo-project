import io from 'socket.io-client';
import React from 'react';

const connectionConfig = {
    jsonp: false,
    transports: ['websocket'],
  };

console.log("Socket connected (socketConfig.js)");
const socket = io("http://localhost:3000", connectionConfig);

export default socket;