const _ = require('lodash');
const moment = require('moment');

const connections = [];

function handleMessage(data) {
  const response = {
    timestamp: moment().format(),
    received: data,
    processed: true
  };
  
  if (data.command) {
    response.result = executeCommand(data.command, data.args);
  }
  
  return response;
}

function handleSocketMessage(data) {
  const merged = _.merge({ timestamp: moment().format() }, data);
  
  return merged;
}

function executeCommand(command, args) {
  switch (command) {
    case 'echo':
      return args;
    
    case 'ping':
      return 'pong';
    
    case 'time':
      return moment().format();
    
    default:
      return `Unknown command: ${command}`;
  }
}

function broadcastMessage(message) {
  connections.forEach(conn => {
    conn.send(JSON.stringify(message));
  });
}

function addConnection(conn) {
  connections.push(conn);
}

function removeConnection(conn) {
  const index = connections.indexOf(conn);
  if (index > -1) {
    connections.splice(index, 1);
  }
}

module.exports = {
  handleMessage,
  handleSocketMessage,
  executeCommand,
  broadcastMessage,
  addConnection,
  removeConnection
};

