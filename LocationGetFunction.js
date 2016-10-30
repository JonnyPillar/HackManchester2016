var location = require('./location.js');

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var challengeId = event.query.challengeId;

  location.get(userId, challengeId, context);
};
