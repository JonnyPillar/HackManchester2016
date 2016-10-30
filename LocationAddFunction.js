var location = require('./location.js');

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var challengeId = event.body.challengeId;
  var name = event.body.name;
  var locationType = event.body.locationType;
  var timestamp = event.body.timestamp;

  var body = {
    challengeId: challengeId,
    name: name,
    locationType: locationType,
    timestamp: timestamp
  };

  location.add(userId, body, context);
};
