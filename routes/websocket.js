const WebSocket = require('ws');
const socketIO = require('socket.io');
const wsService = require('../services/wsService');

module.exports = (server) => {
  const wss = new WebSocket.Server({ 
    server: server,
    path: '/ws'
  });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        const response = wsService.handleMessage(data);
        
        ws.send(JSON.stringify(response));
      } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  const io = socketIO(server, {
    path: '/socket.io'
  });
  
  io.on('connection', (socket) => {
    console.log('Socket.IO client connected');
    
    socket.on('message', (data) => {
      const response = wsService.handleSocketMessage(data);
      socket.emit('response', response);
    });
    
    socket.on('broadcast', (data) => {
      io.emit('broadcast', data);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket.IO client disconnected');
    });
  });
};

