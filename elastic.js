var https = require('https');
var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');

var esDomain = {
  region: 'us-west-2',
  endpoint: 'search-wackshaftchester-i7avkivh4zlasjvlgdzatttxxi.us-west-2.es.amazonaws.com'
};

var endpoint = new AWS.Endpoint(esDomain.endpoint);

function awsRequst(indexName, docType, data) {
  var req = new AWS.HttpRequest(endpoint);

  req.method = 'POST';
  req.path = path.join('/', indexName, docType);
  req.region = esDomain.region;
  req.headers['presigned-expires'] = false;
  req.headers['Host'] = endpoint.host;
  req.body = data;
  return req;
}

module.exports = {
  post: function (indexName, type, data, context) {
    var req = awsRequst(indexName, type, data);

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function (httpResp) {
      var respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });

      httpResp.on('end', function (chunk) {
        console.log('Response: ' + respBody);
        context.succeed('Lambda added document1 ' + data);
      });
    },

    function (err) {
      console.log('Error: ' + err);
      context.fail('Lambda failed with error ' + err);
    });
  }
}
