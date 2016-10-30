console.log('Loading Lambda Function (v1234)');
var AWS = require('aws-sdk');
var awsRequst = require('./aws_request.js');
var path = require('path');

var textInput = require('./text_input.js');
var termVectorParser = require('./term_vector_parser.js');

function getTermVertors(userId, idsWithSwearWords) {
  var url = path.join('/', 'text_input', userId, '_mtermvectors');
  var req = awsRequst.post(url, JSON.stringify({
    "ids" : idsWithSwearWords,
    "parameters": {
          "fields": [
                  "text"
          ],
          "term_statistics": true
      }
  }));
  return req;
}

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var challengeId = event.queryParams.challengeId;
  console.log('challengeIdchallengeIdchallengeIdchallengeId ' + challengeId)
  function getVectors(ids){
    var vectorReq = getTermVertors(userId, ids);

    var nextSend = new AWS.NodeHttpClient();
    nextSend.handleRequest(vectorReq, null, function (httpResp) {
      var respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });

      httpResp.on('end', function (chunk) {
        var results = termVectorParser(respBody);

        context.succeed({
          stats: results
        });
      });
    },

    function (err) {
      console.log('Error: ' + err);
      context.fail('Lambda failed with error ' + err);
    });
  }

  var idsWithSwearWords = textInput.getDirtyWordIds(userId, challengeId, getVectors);
};
