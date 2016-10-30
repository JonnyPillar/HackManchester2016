var location = require('./location.js');

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var challengeId = event.body.challengeId;
  var locationType = event.body.locationType;
  var timestamp = event.body.timestamp;

  var body = {
    challengeId: challengeId,
    locationType: locationType,
    timestamp: timestamp
  };

  location.add(userId, body, context);
};
