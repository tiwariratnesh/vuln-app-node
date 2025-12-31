const axios = require('axios');
const _ = require('lodash');
const requestUtils = require('../utils/requestUtils');

function processResponse(data) {
  if (_.isObject(data)) {
    return _.mapValues(data, (value) => {
      if (_.isString(value)) {
        return value.trim();
      }
      return value;
    });
  }
  
  return data;
}

async function fetchExternalData(url, options) {
  try {
    const response = await axios.get(url, options);
    
    const processed = processResponse(response.data);
    
    return {
      success: true,
      data: processed,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function postExternalData(url, data, options) {
  try {
    const response = await axios.post(url, data, options);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function buildRequestOptions(headers, params) {
  const options = {
    headers: headers || {},
    params: params || {}
  };
  
  return _.merge(options, requestUtils.getDefaultOptions());
}

async function batchFetch(urls) {
  const promises = urls.map(url => axios.get(url));
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => ({
    url: urls[index],
    status: result.status,
    data: result.status === 'fulfilled' ? result.value.data : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
}

module.exports = {
  processResponse,
  fetchExternalData,
  postExternalData,
  buildRequestOptions,
  batchFetch
};

