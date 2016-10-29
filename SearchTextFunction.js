console.log('Loading Lambda Function (v1234)');

var textInput = require('./text_input.js');

exports.handler = function(event, context) {
  textInput.getSwearWordCount("6a721968-7273-4629-be0e-be2bbca5bc38", context);
};
