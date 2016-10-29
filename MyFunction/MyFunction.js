console.log('Loading Lambda Function (v1234)');

var elastic = require('./elastic.js');

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, '  '));
    elastic.post('new_type', '{ hello: "foo" }', context);
};
