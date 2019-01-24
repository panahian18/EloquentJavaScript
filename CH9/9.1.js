// Fill in the regular expressions

verify(/car|and|cat/,
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(/pop culture|mad props/,
       ["pop culture", "mad props"],
       ["plop", "prrrop"]);

verify(/ferret|ferry|ferrari/,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(/\b.*ious\b/,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

verify(/\s[.,:;]/,
       ["bad punctuation ."],
       ["escape the period"]);

verify(/\w{7}/,
       ["hottentottententen"],
       ["no", "hotten totten tenten"]);

verify(/\b[^\We]+\b/,
       ["red platypus", "wobbling nest"],
       ["earth bed", "learning ape", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}

// Second Try

// Fill in the regular expressions

verify(/\w*\sca\w*/,
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(/\w*\s\w*/,
       ["pop culture", "mad props"],
       ["plop", "prrrop"]);

verify(/ferr[^u]\w*/,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(/[ai]cious/,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

verify(/\./,
       ["bad punctuation ."],
       ["escape the period"]);

verify(/\w{7,}/,
       ["hottentottententen"],
       ["no", "hotten totten tenten"]);

verify(/\w*\s\w{4,}/,
       ["red platypus", "wobbling nest"],
       ["earth bed", "learning ape", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}
