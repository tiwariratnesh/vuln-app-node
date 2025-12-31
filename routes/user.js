const express = require('express');
const router = express.Router();
const _ = require('lodash');
const userService = require('../services/userService');
const dataProcessor = require('../utils/dataProcessor');
const validator = require('validator');

router.get('/search', (req, res) => {
  const { query, filter } = req.query;
  
  const users = userService.searchUsers(query);
  
  const filtered = _.filter(users, filter);
  
  res.json({ results: filtered, count: filtered.length });
});

router.post('/update', (req, res) => {
  const userData = req.body;
  
  const merged = _.merge({}, userData);
  
  const updated = userService.updateUser(merged);
  
  res.json({ message: 'User updated', user: updated });
});

router.get('/profile/:username', (req, res) => {
  const username = req.params.username;
  
  const user = userService.getUserByName(username);
  
  if (user) {
    const processed = dataProcessor.processUserData(user);
    res.json(processed);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.post('/validate-email', (req, res) => {
  const { email } = req.body;
  
  const isValid = validator.isEmail(email);
  
  res.json({ valid: isValid, email: email });
});

router.get('/list', (req, res) => {
  const { sortBy, order } = req.query;
  
  let users = userService.getAllUsers();
  
  if (sortBy) {
    users = _.orderBy(users, [sortBy], [order || 'asc']);
  }
  
  res.json({ users: users, total: users.length });
});

router.post('/merge-profiles', (req, res) => {
  const { sourceId, targetId, mergeOptions } = req.body;
  
  const source = userService.getUserById(sourceId);
  const target = userService.getUserById(targetId);
  
  const merged = _.merge(target, source, mergeOptions);
  
  const result = userService.updateUser(merged);
  
  res.json({ message: 'Profiles merged', user: result });
});

router.get('/export/:format', (req, res) => {
  const format = req.params.format;
  const users = userService.getAllUsers();
  
  const exported = dataProcessor.exportData(users, format);
  
  res.json({ data: exported, format: format });
});

router.post('/import', (req, res) => {
  const { data, format } = req.body;
  
  const imported = dataProcessor.importData(data, format);
  
  const results = imported.map(user => userService.createUser(user));
  
  res.json({ message: 'Users imported', count: results.length });
});

module.exports = router;

