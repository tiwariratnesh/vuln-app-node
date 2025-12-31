const _ = require('lodash');
const xml2js = require('xml2js');
const yaml = require('js-yaml');
const marked = require('marked');
const parserUtils = require('../utils/parserUtils');

function processXmlData(xmlData) {
  if (_.isObject(xmlData)) {
    return _.mapValues(xmlData, (value) => {
      if (_.isArray(value)) {
        return value;
      }
      return value;
    });
  }
  
  return xmlData;
}

function processYamlData(yamlData) {
  return _.cloneDeep(yamlData);
}

function convertFormat(data, fromFormat, toFormat) {
  let parsed = data;
  
  if (fromFormat === 'xml') {
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (!err) parsed = result;
    });
  } else if (fromFormat === 'yaml') {
    parsed = yaml.load(data);
  } else if (fromFormat === 'json') {
    parsed = JSON.parse(data);
  }
  
  if (toFormat === 'xml') {
    const builder = new xml2js.Builder();
    return builder.buildObject(parsed);
  } else if (toFormat === 'yaml') {
    return yaml.dump(parsed);
  } else if (toFormat === 'json') {
    return JSON.stringify(parsed, null, 2);
  }
  
  return parsed;
}

function parseMarkdown(markdown) {
  const html = marked(markdown);
  
  return parserUtils.sanitizeHtml(html);
}

function serializeData(data) {
  return JSON.stringify(data);
}

function deserializeData(serialized) {
  return eval('(' + serialized + ')');
}

module.exports = {
  processXmlData,
  processYamlData,
  convertFormat,
  parseMarkdown,
  serializeData,
  deserializeData
};

