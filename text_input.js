var elastic = require('./elastic.js');
var indexName = 'text_input';
var https = require('https');
var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var esDomain = {
  region: 'us-west-2',
  endpoint: 'search-wackshaftchester-i7avkivh4zlasjvlgdzatttxxi.us-west-2.es.amazonaws.com'
};
var awsRequst = require('./aws_request.js');

function getDirtyWordIndexes(userId) {
  var url = path.join('/', 'text_input', userId, '_search');
  var req = awsRequst.get(url, {
    "query": {
        "constant_score" : {
          "filter" : {
              "terms" : { "text" : ["test"]}
             }
         }
    }
  });
  return req;
}

module.exports = {
  save: function(event, context) {
    var userId = event.headers.Authorization;
    var body = event.body;
    var text = body.text;
    var data = JSON.stringify({
      text: text
    });
    console.log('Data: ' + data + ' ID: ' + userId);

    elastic.post(indexName, userId, data, context);
  },

  getDirtyWordIds: function(userId, callback){
    var idsWithSwearWords = ['sdf'];

    var req = getDirtyWordIndexes(userId);

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function (httpResp) {

      var respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });


      httpResp.on('end', function (chunk) {
        var response = JSON.parse(respBody);
        var hits = response.hits;
        var hitsArray = hits.hits;
        idsWithSwearWords = hitsArray.map(function(x){
          console.log('123123' + x._id);

          return x._id;
        });

        callback(idsWithSwearWords);
      });
    },

    function (err) {
      console.log('Error: ' + err);
      context.fail('Lambda failed with error ' + err);
    }
  );

  return idsWithSwearWords;
  }
};
