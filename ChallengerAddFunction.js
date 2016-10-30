var challengers = require('./challenge.js')

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

exports.handler = function(event, context) {
  var userId = event.headers.Authorization;
  var recipientId = event.body.recipientId;
  var type = event.body.type;
  var fromDate = event.body.fromDate;
  var toDate = event.body.toDate;
  var forfeit = event.body.forfeit;
  var customizer = event.body.customizer;

  var data = {
    id: generateUUID(),
    challengerId: userId,
    recipientId: recipientId,
    type: type,
    fromDate: fromDate,
    toDate: toDate,
    forfeit: forfeit,
    customizer: customizer
  };

  challengers.add(data, context);
};
