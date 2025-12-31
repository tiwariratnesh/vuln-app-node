const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');
const yaml = require('js-yaml');
const marked = require('marked');
const serialize = require('serialize-javascript');
const ini = require('ini');
const DOMParser = require('xmldom').DOMParser;
const dataService = require('../services/dataService');
const parserUtils = require('../utils/parserUtils');

router.post('/parse-xml', (req, res) => {
  const { xmlData } = req.body;
  
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: false
  });
  
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const processed = dataService.processXmlData(result);
    
    res.json({
      message: 'XML parsed successfully',
      data: processed
    });
  });
});

router.post('/parse-yaml', (req, res) => {
  const { yamlData } = req.body;
  
  try {
    const parsed = yaml.load(yamlData);
    
    const result = dataService.processYamlData(parsed);
    
    res.json({
      message: 'YAML parsed successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/render-markdown', (req, res) => {
  const { markdown } = req.body;
  
  const html = marked(markdown);
  
  res.json({
    message: 'Markdown rendered',
    html: html
  });
});

router.post('/serialize', (req, res) => {
  const { data } = req.body;
  
  const serialized = serialize(data);
  
  res.json({
    message: 'Data serialized',
    serialized: serialized
  });
});

router.post('/deserialize', (req, res) => {
  const { serializedData } = req.body;
  
  try {
    const deserialized = eval('(' + serializedData + ')');
    
    res.json({
      message: 'Data deserialized',
      data: deserialized
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/parse-ini', (req, res) => {
  const { iniData } = req.body;
  
  try {
    const parsed = ini.parse(iniData);
    
    res.json({
      message: 'INI parsed successfully',
      data: parsed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/parse-dom', (req, res) => {
  const { xmlData } = req.body;
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlData, 'text/xml');
    
    const result = parserUtils.processDomTree(doc);
    
    res.json({
      message: 'DOM parsed successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/convert-format', (req, res) => {
  const { data, from, to } = req.body;
  
  const converted = dataService.convertFormat(data, from, to);
  
  res.json({
    message: 'Format converted',
    data: converted
  });
});

module.exports = router;

