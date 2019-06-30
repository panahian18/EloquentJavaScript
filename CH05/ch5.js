var total = 0; count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}

console.log(total);

// Slow way of counting the range of numbers from 1 to 10

var total = 0; count = 1;

while (count <= 10) {
  total += count;
  count += 1;
}

console.log(total);

// A much easier way to do the above is the following

console.log(sum(range(1, 10)));

// Here we traverse through a simple array the hard way

var array = [1,2,3];
for (var i = 0; i < array.length; i++)
  console.log(array[i]);

var array = [1,2,3];
for (var i = 0; i < array.length; i++) {
  var current = array[i];
  console.log(current);
}

// abstraction of the above method
function logEach(array) {
  for (var i = 0; i < array.length; i++)
	console.log(array[i]);
}

// a more generalized version of the above function
function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}

// A more generalized version of the above function
function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}

// We can even construct a function on the spot, like so
var numbers = [1,2,3,4,5,6], sum = 0;
forEach(numbers, function(number) {
  sum += number;
});

console.log(sum);

// the above funciton with the action funciton declared in the definition
var numbers = [1,2,3,4,5], sum = 0;
forEach(numbers, function (number) {
  sum += number;
});
console.log(sum);

// Previous function included nested for loops to traverse through all events in each entry object in journal
function gatherCorrelations(journal) {
  var phis = {};
  for (var entry = 0; entry < journal.length; entry++) {
    var events = journal[entry].events;
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    }
  }
  return phis;
}

// New version using forEarch
function gatherCorrelationsNew(journal) {
  var phis = {};
  journal.forEach(function(entry) {
    entry.events.forEach(function(event) {
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    });
  });
  return phis;
}

// New version of above using forEach
function gatherCorrelationsNew(journal) {
  var phis = {};
  journal.forEach(function(entry) {
    entry.events.forEach(function(event) {
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    });
  });
  return phis;
}

function gatherCorrelationsNew(journal) {
  var phis = {};
  journal.forEach(function(entry) {
    entry.events.forEach(function(event) {
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    });
  });
return phis;
}

// A high-order function that returns another function
function greaterThan(m) {
  return function(n) { return n > m; };
}

// A high-order function that returns another function
function greaterThan(m) {
  return function(n) {
    return n > m;
  }
}

var greaterThan5 = greaterThan(5);

console.log(greaterThan5(10));

// A highorder function that changes other functions
function noisy(f) {
  return function(arg) {
    console.log("calling with", arg);
    var val = f(arg);
    console.log("called with", arg, "-got", val);
    return val;
  };
}
noisy(Boolean)(0);

function unless(test, then) {
  if(!test) then();
}

function repeat(times, body) {
  for (var i = 0; i < times; i++) body(i);
}

repeat(3, function(n) {
  unless(n % 2, function() {
    console.log(n, "is even");
  });
});

// In order to get all arguments passed to f in the previous functions

function transparentWrapping(f) {
  return function() {
    return f.apply(null, arguments);
  }
}

//JSON stands for js object notation, it is a data storage and communication format

// We can use another way other than forEach to iterate through an array.
function filter(array, test) {
  var passed = [];
  for (var i = 0; i < array.length; i++) {
    if (test(array[i]))
      passed.push(array[i]);
  }
  return passed;
}

// We can use the filter function (native to arrays in JS) to filter based on a funciton

function filter(array, test) {
  var passed = [];
  for (var i = 0; i < array.length; i++) {
    if (test(array[i]))
      passed.push(array[i]);
  }
  return passed;
}

console.log(filter(ancestry, function(person) {
  return person.born > 1925 && person.born < 1950;
}));

console.log(filter(ancestry, function(person) {
  return person.born > 1990 && person.born < 1925;
}));

// In this example we use a map to transform an array by applying a function to
// all its elements and building a new array from returned values.

// The map function allows us to have an array of objects that is the result of
// applying a function to the old values of the array and then returning a new arrays
// The new array will have all the old values of the array except they are now mapped to
// a new form given by the function

function map(array, transform) {
  var mapped = [];
  for (var i = 0; i < array.length; i ++)
    mapped.push(transform(array[i]));
  return mapped;
}

function map(array, transform) {
  var mapped = [];
  for(var i = 0; i < array.length; i++) {
    mapped.push(transform(array[i]));
  }
  return mapped;
}

var overNinety = ancestry.filter(function(person) {
  return person.died - person.born > 90;
});

console.log(map(overNinety, function(person) {
  return overNinety.name;
}));

// In this example we are mapping the ancestry array to those that are over 99 years old
var overNinety = ancestry.filter(function(person) {
  return person.died - person.born > 90;
});

console.log(ancestry.map(function(person) {
  return person.died - person.born > 90;
}));

console.log(map(overNinety, function(person) {
  return person.name;
}));

// Reduce allows us to gather a single value from an array, eg. summing an array.
function reduce(array, combine, start) {
  var current = start;
  for (var i = 0; i < array.length; i++)
    current = combine(current, array[i]);
  return current;
}

// reduce allows us to reduce an array to a single number, eg summing an array
function reduce(array, combine, start) {
  var current = start;
  for (var i = 0; i < array.length; i++)
    current = combine(current, array[i]);
  return current;
}

console.log(reduce([1,2,3,4], function(a, b) {
  return a + b;
}));

console.log(reduce([1,2,3,4],function(a, b) {
  return a + b;
}, 0));

// Higher order functions are functions that take other functions as arguments or that return
// functions, this is seen in the below functions

function greaterThan(n) {
  return function(m) { return m > n; };
}

function repeat(times, body) {
  for (var i = 0; i < times; i++)
     body(i);
}

function unless(test, then) {
  if(!test) then();
}

// Here we use higher-order functions to find the average of an array
function average(array) {
  function plus(a, b) { return a + b };
  return array.reduce(plus) / array.length;
}
function age(person) {
  return person.died - person.born;
}
function male(p) {
  return p.sex == "male";
}
function female(p) {
  return p.sex == "female";
}
console.log(average(ancestry.filter(male).map(age)));
console.log(average(ancestry.filter(female).map(age)));

// This reduce function recursively  goes through the family tree represented
// in the ancestry array and determines

function reduceAncestors(person, f, defaultValue) {  // This function needs 3 values, the person being processed, the function that is being applied to each person and the defualt value for someone not in the traverse
  function valueFor(person) { // Here we define the function that will be applied recursively
    if (person == null)
      return 0;
    else
      return f(person, valueFor(byName[person.mother]), valueFor(byName[person.father])); // recursively call every single person until we reach the top of the tree
    }
    return valueFor(person);
}

// This function also recursively calls itself until it reaches the top of the tree
// It then reaches the top person and returns 1. Then every subsequent offspring of him has half of his DNA.
// Once the top value is reached, 1 is returned, then the children of the top person is calulated, which is (1+0)/2, etc..
function sharedDNA(person, fromMother, fromFather) {
  if (person.name == "Powel Haverbeke")
    return 1;
  else
    return (fromMother + fromFather) / 2;
}

// The following functions computes the above funcitons, however, without using reduceAncestors
function countAncestors(person, test) {
  function combine(current, fromMother, fromFather) {
    var thisOneCounts = current != person && test(current);
    return fromMother + fromFather + (thisOneCounts ? 1 : 0);
  }
  return reduceAncestors(person, combine, 0);
}

function LongLivingPercentage(person) {
  var all = countAnc  estors(person, function(person) {
    return true;
  });
  var longLiving = countAncestors(person, function(person) {
    return (person.died - person.born) >= 70;
  });
  return longLiving / all;
}

function average(array) {
  function plus(a, b) { return a + b};
  return array.reduce(plus) / array.length;
}

// Review
function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]), valueFor(byName[person.father]));
  }
}

function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]), valueFor(byName[person.father]));
  }
  return valueFor(person);
}


function sharedDNA(person, fromMother, fromFather) {
  if (person.name == "powel ...")
    return 1;
  else {
    return (fromMother + fromFather) / 2;
  }
}

// countAncestors will count the number of people that pass a test, it abstracts the reduceAncestors function
function countAncestors(person, test) { // funciton declaration
  function combine(current, fromFather, fromMother) {
    var thisOneCounts = current != person && test(current);
    return fromMother + fromFather + (thisOneCounts ? 1 : 0);
  }
  return reduceAncestors(person, combine, 0);
}

function longLivingPercentage(person) {
  var all = countAncestors(person, function(person) {
    return true;
  });
  var longLiving = countAncestors(person, function(person) {
    return (person.died - person.born) >= 70;
  });
  return longLiving / all;
}

// Review
function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]), valueFor(byName[person.father]));
  }
}

function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]), valueFor(byName[person.father]));
  }
  return valueFor(person);
}


function sharedDNA(person, fromMother, fromFather) {
  if (person.name == "powel ...")
    return 1;
  else {
    return (fromMother + fromFather) / 2;
  }
}

// countAncestors will count the number of people that pass a test, it abstracts the reduceAncestors function
function countAncestors(person, test) { // funciton declaration
  function combine(current, fromFather, fromMother) {
    var thisOneCounts = current != person && test(current);
    return fromMother + fromFather + (thisOneCounts ? 1 : 0);
  }
  return reduceAncestors(person, combine, 0);
}

function longLivingPercentage(person) {
  var all = countAncestors(person, function(person) {
    return true;
  });
  var longLiving = countAncestors(person, function(person) {
    return (person.died - person.born) >= 70;
  });
  return longLiving / all;
}

// a high-order function to sum an array
function average(array) {
  function plus(a,b) { return a + b;}
  return array.reduce(plus) / array.length;
}

function age(p) { return p.died - p.born;}
console.log(average(ancestry.filter(male).map(age)));

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});

// Takes an array of objects and reduces to a value that expresses relatability
function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]), valueFor(byName[person.father]));
  }
  return valueFor(person);
}

function sharedDNA(person, fromMother, fromFather) {
  if (person.name == "Powel")
    return 1;
  else
    return (fromMother + fromFather) / 2;
}

function countAncestors(person, test) {
  function combine(current, fromMother, fromFather) {
    var thisOneCounts = current != person && test(current);
    return fromMother + fromFather + (thisOneCounts ? 1 : 0);
  }
  return reduceAncestors(person, combine, 0);
}

function allAncestors(ancestry) {-
  var all = countAncestors(person, function(person) {
    return true;
  });
}

// Binding will call the original function with some of the arguments already fixed.
var theSet = ["Carel Haverbeke " , "Maria van Brussel " ,
"Donald Duck "];

function isInSet(set, person) {
  return set.indexOf(person.name) > -1;
}

// Bind will return a function that will call isInSet with the first argument ignored
console.log(ancestry.filter(isInSet.bind(null, theSet)));
