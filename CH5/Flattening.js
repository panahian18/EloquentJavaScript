var arrays = [[1, 2, 3], [4, 5], [6]];

// Generic nested array method of flattening arrays.

function flatten(array) {
  var ans = [];
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++)
      ans.push(array[i][j]);
  }
  return ans;
}

console.log(flatten(arrays));

console.log(arrays.reduce(function(a,b,c) {
  return a + b + c;
}));

// This method uses standard JS functions
// filter adds elements from the original array if it passes a test
function filter(array, test) {
  var passed = [];
  for (var i = 0; i < array.length; i++) {
    if (test(array[i]))
      passed.push(array[i]);
  }
  return passed;
}

// map adds elements from an array according to a transforming function
function map(array, transform) {
  var mapped = [];
  for (var i = 0; i < array.length; i++)
    mapped.push(transform(array[i]));
  return mapped;
}

// reduce takes an array and reduces it down to a single value, eg sum
function reduce(array, combine, start) {
  var current = start;
  for (var i = 0; i < array.length; i++)
    current = combine(current, array[i]);
  return current;
}

console.log(arrays.reduce(function(a,b) {
  return a.concat(b);
}, []));
