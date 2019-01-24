function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

/*
In this exercise, we calculate the number of people in the family tree that lived
pass 90 years of age, however, unlike previous examples, we compute this value for the
entire tree of people.
Therefore, we would like to find the average of people of the people in the ancestry data set,
per century.
*/

/*
 1) First, we must filter all members of the family tree to the century they were born in.
 2) Next, for each element in each century group, we compute the average age (died - born)/ array.length;
*/
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

/*
This function takes an array to be grouped and a function that groups them,
It returns a object that maps group names to arrays of group elements;
*/

// First, use filter to create an object that has centuries as properties, and adds person for each century;
// Then


function groupBy(array) {
  return whichCentury(array);
}

function whichCentury(array) {
  var centuries = {};
  var c = 16;
  while (c < 22) {
    centuries[c] = array.filter(function(person) {
      if(Math.ceil(person.died / 100) == c)
        return person;
    });
    c++;
  }
  return centuries;
}

console.log(groupBy(ancestry));
function map(array, transform) {
  var mapped = [];
  for(var i = 0; i < array.length; i++) {
    mapped.push(transform(array[i]));
  }
  return mapped;
}

function avgAge(object) {
  var a = [];
  var i = 0;
  for (var century in object) {
    a.push(object[century].map(function(person) {
      return person.died - person.born;
    }));
    console.log(average(a[i]));
    i++;
  }
}

avgAge(groupBy(ancestry));


// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94
