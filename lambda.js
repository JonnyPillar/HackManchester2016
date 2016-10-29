var lambda = require('./MyFunction.js');
// var lambda = require('./SearchTextFunction.js');

lambda.handler({
        headers: {
          Authorization: "wsddwf"
        },
        body: {
          text: {
            "key1": "value1",
            "key2": "value2",
            "key3": "value3",
            "key4": "value4"
          }

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
