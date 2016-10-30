// var lambda = require('./ChallengerGetFunction.js');
var lambda = require('./SearchTextFunction.js');

lambda.handler({
    headers: {
      Authorization: "34b763d8-3f89-44de-9d65-e4ef80fcf179"
    },
    body: {
      recipientId: '34b763d8-3f89-44de-9d65-e4ef80fcf179',
      type: 'Swear'
    }
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
