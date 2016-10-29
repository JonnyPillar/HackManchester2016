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

  getSwearWordCount: function(userId, context){
    var endpoint = new AWS.Endpoint(esDomain.endpoint);
    var req = new AWS.HttpRequest(endpoint);

    req.method = 'GET';
    req.path = path.join('/', 'text_input', userId, '_search');
    req.region = esDomain.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.body = JSON.stringify({
      "query": {
		      "constant_score" : {
  	        "filter" : {
  	            "terms" : { "text" : ["test"]}
  	           }
      	   }
      }
    });

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
        var idsWithSwearWords = hitsArray.map(function(x){
          return x._id;
        });
        var url = path.join('/', 'text_input', userId, '_mtermvectors');
        var elastic_body = {
        	"ids" : idsWithSwearWords,
        	"parameters": {
                "fields": [
                        "text"
                ],
                "term_statistics": true
            }
        };

        console.log('Ids: ' + idsWithSwearWords);
        console.log('Path: ' + url);
        console.log('Body: ' + JSON.stringify(elastic_body));

        var nextReq = new AWS.HttpRequest(endpoint);

        nextReq.method = 'POST';
        nextReq.path = url;
        nextReq.region = esDomain.region;
        nextReq.headers['presigned-expires'] = false;
        nextReq.headers['Host'] = endpoint.host;
        nextReq.body = JSON.stringify(elastic_body);

        var nextSend = new AWS.NodeHttpClient();
        nextSend.handleRequest(nextReq, null, function (httpResp) {
          var respBody = '';
          httpResp.on('data', function (chunk) {
            respBody += chunk;
          });

          httpResp.on('end', function (chunk) {
            console.log('Response: ' + respBody);
            context.succeed('Lambda added document1 ' + respBody);
          });
        },

        function (err) {
          console.log('Error: ' + err);
          context.fail('Lambda failed with error ' + err);
        });
        //
        // console.log('Response: ' + respBody);
        // context.succeed('Lambda added document1 ' + data);
      });
    },

    function (err) {
      console.log('Error: ' + err);
      context.fail('Lambda failed with error ' + err);
    }
  );
  }
}
