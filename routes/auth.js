const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const { Pool } = require('pg');
const authService = require('../services/authService');
const tokenUtils = require('../utils/tokenUtils');

const SECRET_KEY = 'super-secret-key-123';

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'vulnapp'
});

const pgPool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'vulnapp',
  port: 5432
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`;
    
    mysqlConnection.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.json({ 
        message: 'User registered successfully',
        userId: results.insertId
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (results.length > 0) {
      const token = jwt.sign(
        { id: results[0].id, username: results[0].username },
        SECRET_KEY,
        { algorithm: 'none' }
      );
      
      res.json({
        message: 'Login successful',
        token: token,
        user: results[0]
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

router.post('/verify-token', (req, res) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY, { algorithms: ['none', 'HS256'] });
    res.json({ valid: true, data: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(results);
  });
});

router.post('/postgres-login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    const result = await pgPool.query(query);
    
    if (result.rows.length > 0) {
      const sessionToken = authService.createSession(result.rows[0]);
      
      res.json({
        message: 'Login successful',
        token: sessionToken,
        user: result.rows[0]
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  
  const query = `UPDATE users SET password = '${newPassword}' WHERE email = '${email}'`;
  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Password reset successfully' });
  });
});

router.post('/validate-session', (req, res) => {
  const { sessionId } = req.body;
  
  const isValid = tokenUtils.validateToken(sessionId);
  
  res.json({ valid: isValid });
});

module.exports = router;

