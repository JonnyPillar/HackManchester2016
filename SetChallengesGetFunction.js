var setChallenge = require('./setChallenges.js')

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;

  setChallenge.get(userId, context);
};
