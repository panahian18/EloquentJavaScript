let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
console.log(hasOwnProperty.call(map, "one"));
// → true
