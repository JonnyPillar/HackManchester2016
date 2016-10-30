var elastic = require('./elastic.js');
var indexName = 'text_input';
var https = require('https');
var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var swear_words = require('./swear_words.js');

var esDomain = {
  region: 'us-west-2',
  endpoint: 'search-wackshaftchester-i7avkivh4zlasjvlgdzatttxxi.us-west-2.es.amazonaws.com'
};
var awsRequst = require('./aws_request.js');

function getDirtyWordIndexes(userId, fromDate, toDate) {
  var url = path.join('/', 'text_input', userId, '_search', '?size=10000');
  var data = {
    "query": {
        "bool": {
            "must": [
                {
                		"range" : {
  				              "createdDate" : {
      				            "gte" : fromDate,
      				            "lte" : toDate
        				        }
        				    }
                },
                {
                    "terms": {
                        "text": swear_words
                      }
                }
            ]
         }
    }
  };
  console.log('HGSDJHFGSJDFGSaasdasdasd' + url);
  console.log('HGSDJHFGSJDFGSD' + JSON.stringify(data));

  var req = awsRequst.post(url, JSON.stringify(data));
  return req;
}

module.exports = {
  save: function(event, context) {
    var userId = event.headers.Authorization;
    var body = event.body;
    var challengeId = body.challengeId;
    var text = body.text;
    var data = JSON.stringify({
      challengeId: challengeId,
      text: text,
      createdDate: new Date()
    });

    console.log('JSHDFJKHSDKF ' + JSON.stringify(data));

    elastic.post(indexName, userId, data, context);
  },

  getDirtyWordIds: function(userId, fromDate, toDate, callback){
    var idsWithSwearWords = ['sdf'];

    var req = getDirtyWordIndexes(userId, fromDate, toDate);

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function (httpResp) {

      var respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });


      httpResp.on('end', function (chunk) {
        console.log('REsponseeeseseses ' + respBody);
        var response = JSON.parse(respBody);
        var hits = response.hits;
        var hitsArray = hits.hits;
        idsWithSwearWords = hitsArray.map(function(x){
          return x._id;
        });

        console.log('NUMBER OF INDEXES' + idsWithSwearWords.length);
        console.log('INDEXES' + idsWithSwearWords);

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
