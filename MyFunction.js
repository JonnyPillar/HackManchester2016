console.log('Loading Lambda Function (v1234)');

var text_input = require('./text_input.js');

exports.handler = function(event, context) {


  text_input.save(event, context);
};
