var challengers = require('./challenge.js')

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;

  challengers.get(userId, context);
};
