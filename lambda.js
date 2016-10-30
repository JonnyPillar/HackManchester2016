// var lambda = require('./ChallengerAddFunction.js');
// var lambda = require('./SearchTextFunction.js');
// var lambda = require('./MyFunction.js');
// var lambda = require('./LocationAddFunction.js');
var lambda = require('./LocationGetFunction.js');

lambda.handler({
    headers: {
      Authorization: "34b763d8-3f89-44de-9d65-e4ef80fcf179"
    },
    body: {
      "challengeId": "123",
    	"name": "The pub",
    	"locationType": "foo",
    	"timestamp": "2014-04-23T18:25:43.511Z"
    }
    // body: {
    //   recipientId: '2bf4b429-689f-4c24-ab6e-ccd638b4a6dc',
    //   type: 'swear',
    //   fromDate: "2012-04-23T18:25:43.511Z",
    //   toDate: "2014-04-23T18:25:43.511Z"
    // }
  }, {
    succeed: function(result) {
        console.log("-> CONTEXT SUCEEED: ", result);
    },
    fail: function(err) {
        console.log("-> CONTEXT FAIL: ", err);
    },
    done: function(err, result) {
        console.log("-> CONTEXT DONEL", err, result);
    },
    functionName: 'local_function',
    awsRequestId: 'local_awsRequestId',
    logGroupName: 'local_logGroupName',
    logStreamName: 'local_logStreamName',
    clientContext: 'local_clientContext',
    identity: {
        cognitoIdentityId: 'local_cognitoIdentityId'
    }
});
