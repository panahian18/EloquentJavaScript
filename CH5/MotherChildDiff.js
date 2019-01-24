function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});
//console.log(byName);

//console.log(ancestry.length);
var hasMother = ancestry.filter(function(person) {
  return person.mother != null;});
console.log(hasMother.length);
console.log(hasMother);
var averages = [];

hasMother = hasMother.filter(function(a) {
  return byName[a.mother];});

function calDiff(array) {
  array.forEach(function(a) {
    var mother = byName[a.mother];
    console.log(mother);
    averages.push(a.born - mother.born);
  });
}
calDiff(hasMother);

console.log(averages);
console.log(average(averages));
// → 31.2
