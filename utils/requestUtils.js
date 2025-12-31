const axios = require('axios');
const _ = require('lodash');

function getDefaultOptions() {
  return {
    timeout: 5000,
    headers: {
      'User-Agent': 'VulnApp/1.0',
      'Accept': 'application/json'
    }
  };
}

function buildHeaders(customHeaders) {
  const defaults = getDefaultOptions().headers;
  
  return _.merge(defaults, customHeaders);
}

function handleResponse(response) {
  if (_.isObject(response)) {
    return _.cloneDeep(response);
  }
  
  return response;
}

function handleError(error) {
  return {
    error: true,
    message: error.message,
    stack: error.stack
  };
}

async function makeRequest(url, method = 'GET', data = null, options = {}) {
  try {
    const config = _.merge(getDefaultOptions(), options, {
      method,
      url,
      data
    });
    
    const response = await axios(config);
    
    return handleResponse(response.data);
  } catch (error) {
    return handleError(error);
  }
}

function parseQueryString(queryString) {
  const params = {};
  const pairs = queryString.split('&');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    params[key] = decodeURIComponent(value);
  });
  
  return params;
}

function buildQueryString(params) {
  return Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

module.exports = {
  getDefaultOptions,
  buildHeaders,
  handleResponse,
  handleError,
  makeRequest,
  parseQueryString,
  buildQueryString
};

