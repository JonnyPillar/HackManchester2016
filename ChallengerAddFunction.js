var challengers = require('./challenge.js')

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var recipientId = event.body.recipientId;

  challengers.add(userId, recipientId, context);
};
