const _ = require('lodash');
const moment = require('moment');
const serialize = require('serialize-javascript');

function processUserData(user) {
  const processed = _.pick(user, ['id', 'username', 'email', 'role']);
  
  processed.processedAt = moment().format();
  
  return processed;
}

function mergeData(target, source, options) {
  return _.merge(target, source, options);
}

function filterData(data, criteria) {
  return _.filter(data, criteria);
}

function sortData(data, key, order = 'asc') {
  return _.orderBy(data, [key], [order]);
}

function transformData(data, transformFn) {
  return _.map(data, transformFn);
}

function exportData(data, format) {
  switch (format) {
    case 'json':
      return JSON.stringify(data);
    
    case 'serialized':
      return serialize(data);
    
    case 'csv':
      return convertToCSV(data);
    
    default:
      return data;
  }
}

function importData(data, format) {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    
    case 'serialized':
      return eval('(' + data + ')');
    
    default:
      return data;
  }
}

function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(key => obj[key]));
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function cloneDeep(data) {
  return _.cloneDeep(data);
}

function groupData(data, key) {
  return _.groupBy(data, key);
}

module.exports = {
  processUserData,
  mergeData,
  filterData,
  sortData,
  transformData,
  exportData,
  importData,
  convertToCSV,
  cloneDeep,
  groupData
};

