var elastic = require('./elastic.js');
var indexName = 'text_input';

module.exports = {
  save: function(event, context) {
    var userId = event.headers.Authorization;
    var body = event.body;
    var text = body.text;
    var data = JSON.stringify({
      text: text
    });
    console.log('Data: ' + data);

    elastic.post(indexName, userId, data, context);
  }
};
