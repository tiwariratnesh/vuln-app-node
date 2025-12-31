const express = require('express');
const router = express.Router();
const axios = require('axios');
const request = require('request');
const fetch = require('node-fetch');
const crossFetch = require('cross-fetch');
const apiService = require('../services/apiService');
const requestUtils = require('../utils/requestUtils');

router.get('/fetch-data', async (req, res) => {
  const { url } = req.query;
  
  try {
    const response = await axios.get(url);
    
    const processed = apiService.processResponse(response.data);
    
    res.json({
      message: 'Data fetched successfully',
      data: processed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/proxy-request', (req, res) => {
  const { url, method, data } = req.body;
  
  request({
    url: url,
    method: method || 'GET',
    json: true,
    body: data
  }, (error, response, body) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({
      statusCode: response.statusCode,
      body: body
    });
  });
});

router.post('/fetch-api', async (req, res) => {
  const { url } = req.body;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const result = requestUtils.handleResponse(data);
    
    res.json({
      message: 'Data fetched',
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cross-fetch', async (req, res) => {
  const { url, headers } = req.body;
  
  try {
    const response = await crossFetch(url, { headers });
    const data = await response.json();
    
    res.json({
      message: 'Cross-fetch successful',
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch-requests', async (req, res) => {
  const { urls } = req.body;
  
  const promises = urls.map(url => axios.get(url));
  
  try {
    const results = await Promise.all(promises);
    const processed = results.map(r => apiService.processResponse(r.data));
    
    res.json({
      message: 'Batch requests completed',
      results: processed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/download', async (req, res) => {
  const { url } = req.query;
  
  try {
    const response = await axios.get(url, {
      responseType: 'stream'
    });
    
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', (req, res) => {
  const { webhookUrl, payload } = req.body;
  
  request.post({
    url: webhookUrl,
    json: true,
    body: payload
  }, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({
      message: 'Webhook sent',
      status: response.statusCode
    });
  });
});

module.exports = router;

