var rabbit = {};
rabbit.speak = function(line) {
  console.log("The rabbit says '" + line +"'")
}

rabbit.speak("I'm alive");
// The rabbit says 'I'm alive'.

function speak(line) {
  console.log("The" + this.type + " rabbit says '" + line + "'");
}
var whiteRabbit = {type: "white", speak: speak};
whiteRabbit.speak("Oh my ears and whiskers, " + "how late it's getting!");

// apply() is a method where it calls a method with 2 optional arguments,
// (this, x) calls apply with a specific object. (null, arg) calls the function
// but with a specific array of args. Unlike call, it has to have an array of arguments
// bind(null, x) is a function that can take optionally a this to be the local object that it
// is being called on, or it can take an arugment that binds it to a new function which is just the old function returned.

speak.apply(fatRabbit, ["Burp!"]);
speak.call({type: "old"}, "Oh my.");

// Prototypes

var empty = {};
console.log(empty.toString);
// -> function toString()....{}
console.log(empty.toString());
// -> [object Object]

/*
Objects come from the type Object prototype, Functions from function prototype
and Arrays from Array prototype.
We can use prototype objects to derive key functions that all subtypes will inherit
*/

var protoRabbit = {
  speak: function(line) {
    console.log("The" + this.type + " rabbit says '" + line + "'");
  }
}

var killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKREE");

/*
   Constructors
A constructor is a way of creating objects from some shared prototype. Calling a
function with the new keyword treats it as a constructor. This "this" value will be bound
to a fresh object, and this new object will be returned from the call.
*/


// Example of a Constructors
function Rabbit(type) {
  this.type = type;
}

var killerRabbit = new Rabbit("killer");
var blackRabbit = new Rabbit("black");
console.log(blackRabbit.type);
//-> black

// Constructor
function Rabbit(type) {
  this.type = type;
}

var killerRabbit = new Rabiit(killer);
console.log(killerRabbit.type);
// -> killer;

Rabbit.prototype.speak = function(line) {
  console.log("The", + this.type + "rabbit says '" + line + "'");
}
/*
All constructors and infact all functions have an empty object associated with them
called "prototype", every instance created with new will have this object as its
prototype.
*/


/*
All constructors(which means all functions) have a property named prototype.
This holds by default, a plain empty object that derives from Object.prototype. So every object created with this
constructor will have this object as it prototype.
*/

Rabbit.prototype.speak = function(line) {
  console.log(...);
};

blackRabbit.speak("Doom...");
//-> The black rabbit says 'Doom..'

/*
Functions themselves have a prototype, called Function.prototype, not to be confused
with their prototype property (this is set aside) for the instantiations of objects.
*/


/*
Enumerables properties are properties which are added by assgining them. While, nonenumerable
properties are those which are not added by assigning them. Eg. those properties that are part of
the Object prototype, eg. toString etc. We can define our own nonenumerables by using the
Object.defineProperty(Object.prototype, "hiddenNonesense", {enumerable: false, value: "hi"});
*/

var map = {};
function storePhi(event, phi) {
  map[event] = phi;
}

storePhi("pizza", 0.069);
storePhi("touched tree", -0.081);

Object.prototype.nonsense = "hi";
for (var name in map)
  console.log(name);
  // -> pizza
  // -> touched tree
  // -> nonsense
delete Object.prototype.nonsense;

// Custom nonenumerables can be created by using the Object.defineProperty function

Object.defineProperty(Object.prototype, "hiddenNonesense", {enumerable: false, value: "hi"});

for (var name in map)
  console.log(name);
console.log(map.hiddenNonesense);

// If someone enters hasOwnProperty as a property of their object, we can create new objects without
// any prototype by using Object.create(null);

var map = Object.create(null);
map["pizza"] = 0.069;
console.log("toStirng" in map);
// -> false
console.log("pizza" in map);
// -> true

function rowHeights(rows) {   // rows contains an array of arrays, inner arrays represent a row of cells
  return rows.map(function(row) {  // this returns an object which contains the height of the cells for each row
    return row.reduce(function(max, cell) { // this reduces each inner array to a single height, according to...
      return Math.max(max, cell.minHeight()); // Returns the max of either the predefined max height or the cell's height
    });
  });
}

function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, row) {
      return Math.max(max, cell.minHeight());
    });
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {  // It maps only on the first element of the outer array.
    return rows.reduce(function(max, row) { // it reduces the entire
      return Math.max(max, row[oi)
    })
  })
}

function colWidths(rows) {
  return rows[0].map(function(_ , i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i])
    });
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i]);
    });
  })
}

function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  function drawLine(blocks, lineNo) {
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
    }
}

/*
  DrawTable() has the helper function drawRow(row, rowNum) which, first converts the object cells
  to blocks, this contains arrays of strings to represent each cell.
  The second call to map in drawRow(rows, rowNum) builds up the output for the row by mapping over the lines
  in the left most block and for each line, collecting a line that spans the entire full width of the table.
  These lines are then joined with newLine characters to provide the whole row as drawRow's return value.
*/

// The drawTable(rows) function uses the helper function drawRow to first draw each row into an array of strings
function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

// This function takes a row and return an array of strings called blocks, which are the cells mapped to strings.
  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {  // blocks is an arrya of strings, it converts each cell object in the row.
      return cell.draw(widths[colNum], heights[rowNum]);
    });
    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
    }
}

// Simple way to instantiate an objects
var protoRabbit = {
  speak: function(line) {
    console.log(" The " + this.type + " rabbit says '" +
      line + " '");
  }
};

var killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";

// Same as above using a constructor
function Rabbit(type) {
  this.type = type;
}
var killerRabbit = new Rabbit(killer);

Object.prototype.nonsense = "hi";
var map = {};
for (var name in map) {
  console.log(name);
}

// Enumerables are all properties of objects that we assign.
// toString is not assigned, instead it comes standard with all objects as it is a property of the Objects.prototype object.

Object.definePrototype(Object.prototype, "hiddenNonesense", {enumerable: false, value: "hi"});

Object.definePrototype(Object.prototype, "hiddenNonesense",
  {enumerable: false, value: "hi"});

// We can use the hasOwnProperty method in all objects to return only enumerable objects.
for (var name in map) {
  if(map.hasOwnProperty(name))
    console.log(name);
}

// We can create objects with no prototypes using the var map = Object.create(null);

/*
  Polymorphism is one the main princicples of OO programming (including inheritance, encapsulation, and abstraction)
  it states that a feature defined for one type of object can work for other types of objects, as long as it supports its interface
*/

/*
  In this function, we first apply the map function to the rows[0] array, this is the first array in the array of rows.
  We then want the max width applied to each element in the row, in other words the width of the column.
  The callback function used in the map function is only concerned with the index of each element in the first array, the actual
  element is not needed. The map callback function maps each element by using a reduce function that reduces the width of the first
  element in each index of all the rows. In other words, we take the width of the first column and map it onto the first element of
  the first row. We do this by iterating i, which is each column.
*/
function colWidths(rows) { // This function returns an array, in which each element is the width of the column
  return rows[0].map(function(_, i) { // Here we are mapping on just the first element in the rows arrays, i.e. the first row.
    return rows.reduce(function(max, row) { // Here we only care about the index of each element in rows[o]
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}
/*
  We can obtain the width of each cell by using the minWidth function
*/
TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};

// This statement is the first statement that is called in the drawTable function
// The map function is being used on the rows array, meaning it is returning an array
// where each row has been "drawn".
return rows.map(drawRow).join("\n");

/* This function returns an array called blocks, each row is being mapped by the draw function, it takes
   the widths[colNum] and the heights[rowNum]. This is looking at the heights and widths variables (which are arrays).
   Since drawRow is a callback function for a map function, the rowNum is the index that is currently being iterated on
   The same goes for colNum. Since cell.draw is in a map within a map, it is going to draw all of the cells in the first row,
   before moving on to the next row.
*/
function drawRow(row, rowNum) {
  var blocks = row.map(function(cell, colNum) {
    return cell.draw(widths[colNum], heights[rowNum]);
  });
}
var array = [0,2,3,3,4];
for (var i = 0; i < array.length; i++) {
  var current = array[i];
  console.log("current");
}
function forAll(array, transform) {
  for (var i = 0; i < array.length; i++)
    transform(array[i]);
}
function mapper(array, transform) {
  var mapped = [];
  for (var i = 0; i < arrayy.length; i++)
    mapped.push(transform(array[i]));
  return mapped;
}
function filter(array, test) {
  var filtered = [];
  for (var i = 0; i < array.length; i++)
    if (test(array[i]))
      filtered.push(array[i]);
}
function reduce(array, reducer, base) {
  var current = start;
  for (var i = 0; i < array.length; i++)
   current = reducer(array[i], current);
  return current;
}
// This constructor will create a new object and it will create an array if there are new lines in the string.
function TextCell(text) {
  this.text = text.split("\n");
}

/* Finding the Heights */

// This function will return the heights of the rows in the table
function rowHeights(rows) {
  return rows.map(function(row) { // we are mapping over the rows, transforming each array into a number that is the height
    return row.reduce(function(max, cell) { // each row gets mapped by applying a reduce function, which reduces a single value
      return Math.max(max, cell.minHeight()); // Each row gets reduced with a function that finds the max height of it.
    }, 0);
  });
}

// We use the colWidths() function to calculate the width of the columns
function colWidths(rows) { //We take as an argument the rows array
  return rows[0].map(function(_, i) { // Here we are returning an array in which the rows array has the col width mapped to the first ele. in the ar.
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth);
    }, 0);
  });
}

function rowHeight(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

Textcell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0)
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minHeight());
    }, 0);
  });
}

function drawRow(row, rowNum) {
  var blocks = row.map(function(cell, colNum) {
    return cell.draw(widths[colNum], heights[rowNum]);
  });
  return
}

function drawLine(blocks, lineNo) {
  return blocks.map(function(block) {
    return block[lineNo];
  }).join(" ");
}

// Methods in javascript are properties of objects that hold functions
let rabbitt = {};
rabbitt.speak = function(line) {
  console.log(`'The rabbit says ${line}'`);
};

// Usually a method needs to do something on the object that it was called on, when a method is looked
// and immediately called, as in object.method() the binding called this in its body automatically points to the object that it was called on

function speak(line) {
  console.log(`The ${this.type} rabbit says ${line}`);
}
let whiteRAbbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRAbbit.speak("Oh my ear and whiskers,"+ "how late it's getting");
hungryRabbit.speak("I could use a carrot right now");

// You can use the call method of functions which takes the this value as the first argument
speak.call(hungryRabbit, "Burp");

// The arrow function in ECMA6 allows us to use shorter syntax and to not pass on "this" in the nested scope
// The .call method allows you to use your own this as an extra parameter for the function
function normalize() {
  console.log(this.coords.map(n => n / this.length));
}
normalize.call({coords: [0, 2, 3], length: 5});

//   --  Prototypes  --
// A prototype is another object that all objects have as a fallback as a source of properties.
// When an object gets a request for a property that it does not jave then its prototype will be
// searched for those properies. If that prototype does not have it then a higher up prototype gets
// called and this continues all the way until the object.prototype.

console.log(Object.getPrototypeOf({}) == Object.prototype);

// Functions and Arrays don't have Object.prototype as their prototype, they have Function.prototype and Array.prototype
// However, such prototypes have their own prototypes, Object.prototype, so that they cna inherit toString etc.

// We can use Object.create to create an object with a specific prototype.
let protorabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says ${line}`);
  }
};
let killerrabbit = Object.create(protorabbit);
killerrabbit.type = "killer";
killerrabbit("skree");

// -- Classes
// Javascript's prototype system can be interpreted as the Class feature as seen in object
// oriented programming. Prototypes define the attributes and methods of an object, all
// instantiations of that prototype have those same features.

// Making instantiations
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit)
  rabbit.type = type;
  return rabbit;
}

// Using a constructor
function Rabbit(type) {
  this.type = type;
}
let weirdRabbit = new Rabbit("weird");

// All functions (including constructors) automatically get a property named prototype,
// which by default holds a plain, empty object that derives from Object.prototype. This
// can be overwritten by a new object if needed. Or you can add new properties to it.

// ECMA6 class notation
class Rabbitt {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`"The ${this.type} Rabbit says ${line}"`);
  }
}

let killRabbit = new Rabbitt("killer");

// class can be used in expression positions also, in this case it produces the constructor as value
let object = (new class { getWord() {return "hello";}});

// Javascript has a Map data structure that allows us to use a Map without worrying about
// prototypes getting in the way.

let ages = new Map();
ages.set("Boris", 39);

console.log(`Boris is ${ages.get("Boris")} years old`);
console.log("Is Jack's age known?", ages.has("Jack"));

// Object.keys returns an object's own keys, not those in the prototype. As an alternative
// to the in operator, you can use the hasOwnProperty method, which ignores the object's prototype

// -- Polymorphism
// When a piece of code is written to work with objects that have a certain interface, any kind of
// object that happens to support this interface can be plugged into that code, and it will just work.
// For example, the toString function can be overridden in Rabbit.prototype. For/of loops are used by
// many data structures, this is another example of Polymorphism

// -- Symbols
// Sometimes multiple interfaces use the same property name to mean different things.
// Property names can be either Strings or symbols, which are values created by the Symbol function.
// They can only be unique, you cannot create the same symbol twice.

// -- Symbols
// Property names can be either strings or symbols, which are values returned by the symbol
// function. Unlike strings, symbols are unique, you cannot create the same symbol twice.

let sym2 = Symbol("test");
console.log(sym2 == Symbol("test"));
// -> false

let sym = Symbol("sym");
console.log(sym == Symbol("sym"));
// -> false

Rabbit.prototype[sym] = 55;
console.log(blackRabbit[sym]);
// -> 55

// This allows us to define property names that can be used with an arbitrary number of properties
const toStringSymbol = Symbol("toString");
Array.prototype[toStringSymbol] = function() {
  return `${this.length} cm of blue yarn`;
};

console.log([1,2].toString());
// -> 1,2
console.log([1,2][toStringSymbol]());
// -> 2 cm of blue yarn

// This allows us to define property names that can be used with an arbitrary number of properties
const toStringSymbol2 = Symbol("toString");
Array.prototype[toStringSymbol2] = function() {
  return `${this.length} cm of blue yarn`;
};

console.log([1,2].toString());
// -> 1,2
console.log([1,2][toStringSymbol2]());
// -> 2 cm of blue yarn

// It is possible to include symbol properties in object expressions and classes by using
// square brackets around the property name. That causes the property name to be evaluated,
// much like the square bracket property notation.

let stringObject = {
  [toStringSymbol]()  { return "a jute rope"; }
};
console.log(stringObject[toStringSymbol]());
// We can also use symbol properties in object expressions and classes by using sqaure brackets
// around the property name. This causes the property name to be evaluated, much like the bracket
// property access notation, which allows us to access the binding that holds the symbol.

let StringObjectt = {
  [toStringSymbol]() { return "a jute rope";}
};

console.log(stringObject[toStringSymbol]());
// -> a jute rope

// -- The Iterator interface
// The object given to a for/in loop is expected to be iterable. This means that it has a method
// named with the Symbol.iterator symbol (a symbol value defined by the language, stored as a
// property of the symbol function). When that method is called, it should provide a second interface
// that returns the next result.

let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
// -> {value: "0", done: false}

// Here we implement an iterable data structure. We'll build a matrix class, acting as a two-dimensional array

class Matrix {
  constructor(width, height, content = () => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++)
        this.content[y * width + x] = content(x, y);
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }
  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}

class MatrixIterator {
  constructor(matrix) {
    this.x = 0;
    this.y = 0;
    this.matrix = matrix;
  }
  next() {
    if (this.y == this.matrix.height)
      return {done: true};
    let value = {x: this.x, y: this.y,
      value: this.matrix.get(x,y)};
    this.x++;
    if (this.x == this.matrix.width) {
      this.x = 0;
      this.y++;
    }
    return {value, done: true};
  }
}

// We place this in the Matrix class
Matrix.prototype[Symbol.iterator] = funciton() {
  return new MatrixIterator(this);
};

let matrix = new Matrix(2,2,(x,y) => `value ${x}, ${y}`);
for (let {x, y, value} of matrix) {
  console.log(x, y, value);
}

// Sometimes you want to attach some property directly to your constructor function,
// rather than the prototype. Such methods won't have access to the class interface,
// but can for example be used to provde addtional ways to create instances.

// Eg. of a static method
static fromFahrenheit(value) {
  return new Temperature((value - 32) / 1.8);
}

Temperature.fromFahrenheit(100);

// -- Inheritance
// To use inheritance we need to use the super() method in the constructor to invoke
// the parent classes constructor. We also need to use the extends keyword in the class
// declaration. Also, when using methods of the super class, we need to use the super()
// method.

class SymmertricMatrix extends Matrix {
  constructor(size, content = (x, y) => undefined) {
    super(size, size, (x,y) => {
      if (x < y) return content(y,x);
      else return content(x,y);
    });
  }
}
