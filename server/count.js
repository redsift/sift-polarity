/**
 * Sift Polarity. DAG's 'Count' node implementation
 */
'use strict';

// Entry point for DAG node
module.exports = function (got) {
  const inData = got['in'];

  console.log('sift-polarity: count.js: running...');
  var messages = 0;
  var words = 0;
  inData.data.map(function (datum) {
    var jd = JSON.parse(datum.value);
    words = words + jd.words;
    messages++;
  });

  return [
    { name: 'count', key: 'MESSAGES', value: messages },
    { name: 'count', key: 'WORDS', value: words }
  ];
};
