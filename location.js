var indexName = 'location';
var elastic = require('./elastic.js');
var https = require('https');
var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var awsRequst = require('./aws_request.js');

function getReq(userId, challengeId) {
  var url = path.join('/', indexName, userId, '_search', '?size=1000');
  var req = awsRequst.post(url, JSON.stringify({
    "query": {
      "bool": {
        "must": {
          "terms": {
            "challengeId": [challengeId]
          }
        }

      }
    }
  }));
  return req;
}

module.exports = {
  add: function(userId, body, context){
    var postBody = JSON.stringify(body);

    elastic.post(indexName, userId, postBody, context);
  },

  get: function(userId, challengeId, context){
    var req = getReq(userId, challengeId);

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

        var placeCount = {};

        var results = hits.forEach(function(hit){
          var locationType = hit._source.locationType;

          if(placeCount[locationType]){
            placeCount[locationType] = placeCount[locationType] + 1;
          }else {
            placeCount[locationType] = 1;
          }
        });

        context.succeed({
            results: Object.keys(placeCount).map(function(key) {
              return {
                place: key,
                count: placeCount[key]
              }
            })
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
