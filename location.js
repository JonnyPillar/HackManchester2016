var indexName = 'location';
var elastic = require('./elastic.js');

module.exports = {
  add: function(userId, body, context){
    var postBody = JSON.stringify(body);

    elastic.post(indexName, userId, postBody, context);
  }
};
