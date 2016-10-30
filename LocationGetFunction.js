var location = require('./location.js');

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var fromDate = event.query.fromDate;
  var toDate = event.query.toDate;

  location.get(userId, fromDate, toDate, context);
};
