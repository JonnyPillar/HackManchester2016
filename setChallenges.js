var indexName = 'challengers';
var elastic = require('./elastic.js');
var https = require('https');
var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var awsRequst = require('./aws_request.js');


function getReq(userId) {
  var url = path.join('/', indexName, 'active', '_search', '?size=10000');
  var req = awsRequst.post(url, JSON.stringify({
    "query": {
      "bool": {
        "must": {
          "term": {
            "challengerId": userId
          }
        }

      }
    }
  }));
  return req;
}

module.exports = {
  get: function(userId, context){
    var req = getReq(userId);

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function (httpResp) {

      var respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });


      httpResp.on('end', function (chunk) {
        var body = JSON.parse(respBody);
        console.log("DSFFSDFSDF" + respBody);

        var hits = body.hits.hits;

        var results = hits.map(function(hit){
          return hit._source;
        });

        context.succeed({
            results: results
          }
        );
      });
    },

    function (err) {
      console.log('Error: ' + err);
      context.fail('Lambda failed with error ' + err);
    }
  );
  }
};
