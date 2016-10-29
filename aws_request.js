var AWS = require('aws-sdk');

var esDomain = {
  region: 'eu-west-2',
  endpoint: 'search-wackshaftchester-i7avkivh4zlasjvlgdzatttxxi.us-west-2.es.amazonaws.com'
};

var endpoint = new AWS.Endpoint(esDomain.endpoint);

function awsRequst(httpType, url, data) {
  var req = new AWS.HttpRequest(endpoint);

  req.method = httpType;
  req.path = url;
  req.region = esDomain.region;
  req.headers['presigned-expires'] = false;
  req.headers['Host'] = endpoint.host;
  if(httpType != 'GET'){
    req.body = data;
  }
  return req;
}

module.exports = {
  get: function(url, body){
    return awsRequst('GET', url, body);
  },

  post: function(url, body){
    return awsRequst('POST', url, body);
  }
};
