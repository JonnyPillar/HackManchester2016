
//Hack central
var swear_words = require('./swear_words.js');

module.exports = function(responseBody){
  var body = JSON.parse(responseBody);
  var results = {};

  body.docs.forEach(function(doc) {
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
