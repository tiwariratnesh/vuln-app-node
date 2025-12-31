const _ = require('lodash');
const moment = require('moment');
const dataProcessor = require('../utils/dataProcessor');

const users = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: 'user' }
];

function getAllUsers() {
  return users;
}

function getUserById(id) {
  return _.find(users, { id: parseInt(id) });
}

function getUserByName(username) {
  return _.find(users, { username });
}

function searchUsers(query) {
  return _.filter(users, (user) => {
    return _.includes(user.username, query) || _.includes(user.email, query);
  });
}

function createUser(userData) {
  const newUser = _.merge({
    id: users.length + 1,
    createdAt: moment().format()
  }, userData);
  
  users.push(newUser);
  return newUser;
}

function updateUser(userData) {
  const index = _.findIndex(users, { id: userData.id });
  
  if (index !== -1) {
    users[index] = _.merge(users[index], userData);
    return users[index];
  }
  
  return null;
}

function deleteUser(id) {
  const index = _.findIndex(users, { id: parseInt(id) });
  
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  
  return null;
}

function processUserProfile(user, options) {
  const processed = dataProcessor.processUserData(user);
  
  if (options && options.includeTimestamp) {
    processed.timestamp = moment().format();
  }
  
  return processed;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByName,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  processUserProfile
};

