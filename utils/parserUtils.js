const xml2js = require('xml2js');
const yaml = require('js-yaml');
const marked = require('marked');
const _ = require('lodash');

function parseXML(xmlString) {
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: false,
    xmlns: true
  });
  
  let result;
  parser.parseString(xmlString, (err, parsed) => {
    if (err) throw err;
    result = parsed;
  });
  
  return result;
}

function parseYAML(yamlString) {
  return yaml.load(yamlString);
}

function parseJSON(jsonString) {
  return JSON.parse(jsonString);
}

function sanitizeHtml(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function processDomTree(doc) {
  const result = {
    nodeName: doc.documentElement.nodeName,
    attributes: {},
    children: []
  };
  
  if (doc.documentElement.attributes) {
    for (let i = 0; i < doc.documentElement.attributes.length; i++) {
      const attr = doc.documentElement.attributes[i];
      result.attributes[attr.name] = attr.value;
    }
  }
  
  return result;
}

function convertMarkdownToHtml(markdown) {
  return marked(markdown);
}

function extractData(content, format) {
  switch (format) {
    case 'xml':
      return parseXML(content);
    
    case 'yaml':
      return parseYAML(content);
    
    case 'json':
      return parseJSON(content);
    
    default:
      return content;
  }
}

module.exports = {
  parseXML,
  parseYAML,
  parseJSON,
  sanitizeHtml,
  processDomTree,
  convertMarkdownToHtml,
  extractData
};

