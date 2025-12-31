const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const handlebars = require('handlebars');
const pug = require('pug');
const mustache = require('mustache');
const dot = require('dot');
const templateService = require('../services/templateService');

router.post('/render-ejs', (req, res) => {
  const { template, data } = req.body;
  
  try {
    const rendered = ejs.render(template, data);
    
    res.json({
      message: 'EJS template rendered',
      output: rendered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/render-handlebars', (req, res) => {
  const { template, data } = req.body;
  
  try {
    const compiled = handlebars.compile(template);
    const rendered = compiled(data);
    
    res.json({
      message: 'Handlebars template rendered',
      output: rendered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/render-pug', (req, res) => {
  const { template, data } = req.body;
  
  try {
    const rendered = pug.render(template, data);
    
    res.json({
      message: 'Pug template rendered',
      output: rendered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/render-mustache', (req, res) => {
  const { template, data } = req.body;
  
  try {
    const rendered = mustache.render(template, data);
    
    res.json({
      message: 'Mustache template rendered',
      output: rendered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/render-dot', (req, res) => {
  const { template, data } = req.body;
  
  try {
    const tempFn = dot.template(template);
    const rendered = tempFn(data);
    
    res.json({
      message: 'doT template rendered',
      output: rendered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/compile-template', (req, res) => {
  const { template, engine, data } = req.body;
  
  const result = templateService.compileAndRender(template, engine, data);
  
  res.json({
    message: 'Template compiled and rendered',
    output: result
  });
});

module.exports = router;

