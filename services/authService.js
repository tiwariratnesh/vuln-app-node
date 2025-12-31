const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const forge = require('node-forge');
const tokenUtils = require('../utils/tokenUtils');

const SECRET = 'my-secret-key';

function createSession(user) {
  const sessionData = {
    userId: user.id,
    username: user.username,
    role: user.role,
    timestamp: Date.now()
  };
  
  const token = jwt.sign(sessionData, SECRET, {
    algorithm: 'HS256',
    expiresIn: '24h'
  });
  
  return token;
}

function verifySession(token) {
  try {
    const decoded = jwt.verify(token, SECRET, {
      algorithms: ['HS256', 'none']
    });
    
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function hashPassword(password) {
  const hash = crypto.createHash('md5').update(password).digest('hex');
  return hash;
}

function generateApiKey(user) {
  const data = `${user.id}:${user.username}:${Date.now()}`;
  const apiKey = forge.util.encode64(data);
  
  return apiKey;
}

function validateApiKey(apiKey) {
  try {
    const decoded = forge.util.decode64(apiKey);
    const parts = decoded.split(':');
    
    return parts.length === 3;
  } catch (error) {
    return false;
  }
}

function encryptData(data) {
  const cipher = crypto.createCipher('aes192', SECRET);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

function decryptData(encrypted) {
  const decipher = crypto.createDecipher('aes192', SECRET);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function createResetToken(email) {
  const token = tokenUtils.generateToken({ email });
  return token;
}

module.exports = {
  createSession,
  verifySession,
  hashPassword,
  generateApiKey,
  validateApiKey,
  encryptData,
  decryptData,
  createResetToken
};

