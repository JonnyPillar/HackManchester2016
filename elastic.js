var https = require('https');
var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var awsRequst = require('./aws_request.js');

function elasticPostRequest(indexName, docType, data) {
  var url = path.join('/', indexName, docType);
  var req = awsRequst.post(url, data);
  return req;
}

module.exports = {
  post: function (indexName, type, data, context) {
    postReq = elasticPostRequest(indexName, type, data);

    var send = new AWS.NodeHttpClient();
    send.handleRequest(postReq, null, function (httpResp) {
      var respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });

      httpResp.on('end', function (chunk) {
        console.log('Response: ' + respBody);
        context.succeed(JSON.parse(data));
      });
    },

    function (err) {
      console.log('Error: ' + err);
      context.fail(err);
    });
  },

}
