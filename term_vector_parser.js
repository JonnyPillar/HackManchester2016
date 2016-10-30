
//Hack central
var swear_words = require('./swear_words.js');

module.exports = function(responseBody){
  var body = JSON.parse(responseBody);
  var results = {};
  console.log('RESPONSE BODY ' + responseBody);

  if(!body.docs) {
    return [];
  }

  body.docs.forEach(function(doc) {
    if(doc.term_vectors.text){
      var terms = doc.term_vectors.text.terms;

      Object.keys(terms).forEach(function(key,index) {
        if(results[key]){
          var currentCount = results[key];
          var toAdd = terms[key].term_freq;
          results[key] = currentCount + toAdd;
        } else {
          var count = terms[key].term_freq;
          results[key] = count;
        }
      });
    } else {
      console.log('ERROR ' + JSON.stringify(doc));
    }
  });

  var foundWords = Object.keys(results).filter(function(key){
    return swear_words.indexOf(key) >= 0;
  });

  return foundWords.map(function(key) {
    return {
      word: key,
      count: results[key]
    };
  });
};
