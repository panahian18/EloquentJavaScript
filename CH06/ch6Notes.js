// -- Encapsulation

/*
    A hallmark of object oriented programming is the practice of breaking down programs into smaller
    pieces of code and making each of these pieces responsible for their own functioning. This way
    any change in the code will only affect that local environment. These pieces of code interact with
    each other by the use of interfaces, which abstract away the implementation of these pieces of code.
    Interfaces consist of a limited set of functions or bindings, with their implementations abstracted away.
    Their interface consists of a specific set of methods and properties, properties that are part of the interface
    are called public, those that aren't meant to be touched are called private. Javascript does not disitnguish
    between public and private properties. Typically, an underscore is place at the beggining of a property to
    indicate its private nature. Encapsulation is this seperation of the interface from the implementaiton.
*/

// -- Methods

    // Methods are properties that hold function values.

// rabbit.speak implementation

let Rabbit = {};
Rabbit.speak = funciton(line) {
  console.log(`The rabbit says ${line}`);
}
Rabbit.speak("hello");

// We can also access properties of the object being called on by using the ".this" operator
Rabbit.talk = function("line") {
  console.log(`The ${this.type} rabbit says ${line}`);
}

let whiteRabbit = {type: "White", speak};
let blackRabbit = {type: "black", speak};

whiteRabbit.speak("hello");
blackRabbit.speak("hello");

// .call method, this method call a method and uses "this" as an argument
speak.call(hungryRabbit, "Burp");

// normalize function, all functions have their own this binding, therefore you cannot refer to
// the this or a wrapping scope in a regular function defined with the function keyword

function normalize() { // arrow functions do not have a this binding.
  console.log(this.coords.map(n => n / this.length));
}

normalize.call({coords: [0,2,3], length: 5});
//-> 0, 0.4, .06

// -- Prototypes

// All JS objects have a prototype object as a fallback, in addition to their properties. It is an inherited obj.
// When a object gets a call for a property it does not have, it then searches in its prototype

// Prototypes of empty Objects: all objects are eventually inherited from Object.prototype but many
// objects don't have Object.prototype as their prototype, eg. Array.prototype and Function.prototype

// Object.create: you can use object.create to create an object with a specific prototype, eg.

let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}''`);
  }
}
// A property like speak(line) in an object expresssion is a shorthand for defining a method.
// It defines a property called speak and gives it a function as a value.

let scaryRabbit = Object.create(protoRabbit);
scaryRabbit.type = "scary";
scaryRabbit.speak("SKREE");

// -- Classes

// Constructors ensure that objects have all the properties derived from a prototype but that They
// also have their own properties.

function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}

// If you put new infornt of a function, it is treated as a constructor, this means that an object with
// the right prototype is created and bound to this in the function, and returned at the end of the function

// The appropriate prototype is found by taking the prototype property of the function.


function Rabbit(type) {
 this.type = type;
}

Rabbit.prototype.speak = function(line) {
  console.log(`This ${this.type} rabbit says '${line}'`);
};

let weirdRabbit = Rabbit("weird");

// All functions can be used a constructor as they all have a property called prototype, which by default stores
// Object.prototype, but it can be overridden

// -- Class notation

class Rabbit {
  constructor(type) {
    this.type = type;
  }

  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}''`);
  }
}

let happyRabbit = new Rabbit(happy);

// In JS we use class notation to group constructors and method declarations together.
// The method declarations get added to the object's prototype. Only methods can be added.
// class can also be used as an expression, it simply returns a consturctor as a value. You can omit the class name

let object = (new class {getWord() {return "hello";} });

console.log(object.getWord());

// -- maps

// A map is a datastructure that associates values with other values. Eg. storing names with arguments

let ages = {
  boris: 50,
  john:  45,
  bob:   22
};

console.log(`boris is ${ages["boris"]} years old.`);
console.log("Is john's age known?", "Jake" in ages);
console.log("Is tostring's age known?", "toString" in ages);

// toString is in our object because objects derive from Object.prototype, which contain toString in their proto.
// There are two ways to overcome this, first we can create an object with null passed to Object.create
// We can also use the Map d.s. included in JS

let emptyAges = Object.create(null);

let properAges = new Map();
properAges.set("boris, 50");
properAges.set("john, 45");
properAges.set("bob, 2");

console.log(`boris is ${properAges.get("boris")}`);
console.log("Is john in properAges?", properAges.has("john"));

// Map d.s. have set, get, and has as part of their interface.
// If you do have a plain object that you need to treat as a map, you can use Object.key, which only Return
// an object's own properties, you can also use hasOwnProperty method, which ignores the object's prototype.

console.log({x: 1}.hasOwnProperty("x"));
// -> true

// -- Polymorphism

//  When a piece of code is written to work with objects that have a certain interface, in this case, a toString
// method, any kind of object that happens to support this interface can be plugged into the code.
// For example, we can override the toString() method as long as our new code supports the original interface

Rabbit.prototye.toString = function() {
  console.log(`a ${this.type} rabbit`);
}
// Other classic examples are the shape class, with draw method, circle, square etc. all have this method, but They
// all implement it different, but with same results.

// -- symbols

// Symbols are unique identifiers similar to stirngs, except that there can be no duplicate symbols, they are
// created with the symbol function
let sym = Symbol("sym");
let sym2 = Symbol("hello");

console.log(sym == Symbol("sym"));
// --> false
Rabbit.prototype[sym] = 55;

const toStringSymbol = Symbol("toString");

// We can use symbol to define property names in two ways
Array.prototype[toStringSymbol] = function() {
  return `${this.length} cm of blue yarn`;
};

console.log([1,2,3][toStringSymbol]());

// Or we can use property names in object expressions
let stringObject = { [toStringSymbol]() { return "a jute rope";}
};

console.log(stringObject[toStringSymbol]());

// -- The Iterator interface

// An object given to the for/of loop is expected to be iterable. This means that it has a method named with the
// Symbol.iterator symbol (a symbol value defined by the language, stored as a property of the symbol function)
// An iterator must implement the next, value, and done properties.

let okIterator = "ok"[Symbol.iterator()];
console.log(okIterator.next());

// Here we iterate an iteratble data structure. We will build a matrix class, acting as a 2-D array.
class Matrix {
  constructor(width, height, content = () => undefined) {
      this.width = width;
      this.height = height;
      this.content = [];
      for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++)
          this.content[y * width + x] = content(x, y);
      }
  }
  get(x, y) {
    return this.content[this.width * y + x];
  }
  set(x, y, value) {
    [this.width * y + x] = value;
  }
}

class MatrixIterator {
    constructor(matrix) {
      this.x = 0;
      this.y = 0;
      this.matrix = matrix;
    }
    next() {
      if (this.y == this.matrix.height) return {done: true};
      let value = {x: this.x, y: this.y, value: this.matrix.get(this.x, this.y)};
      this.x++;
      if (this.x == this.matrix.width) {
        this.x = 0;
        this.y++;
      }
      return {value, done: true};
    }
}

// Making the Matrix class iterable
Matrix.prototype[Symbol.iterator] = function() {
  return new MatrixIterator(this);
};

// We can loop over a matrix with a for/of loop:
let matrix = new Matrix(2, 2, (x,y) => `value of ${x}, ${y}`);
for (let {x, y, value} of matrix);
console.log(x, y, value);

// -- Inheritance

//  A symmetrical version of Matrix that inherits from Matrix

class SymmetrixMatrix extends Matrix {
  constructor(size, content = (x, y) => undefined) {
    super(size, size, (x, y) => {
      if (x < y) return content(y, x);
      else return (x, y);
    });
  }
  set(x, y, value) {
    super.set(x, y, value);
    if (x != y) {
      super.set(y, x, value);
    }
  }
}

// symbols
var toStringSymbol = Symbol("toString");

// Matrix Class
var Matrix = class Matrix {
  constructor(height, width, content = (x, y) => undefined) {
    this.height = height;
    this.width = width;
    this.content = [];

    for (var y = 0; y < height; y ++) {
        for (var x = 0; x < width; x++)
          this.content[y * width + x] = content(x, y);
    }
  }
  getX(x, y) {
    return this.content[y * this.width + x];
  }
  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}

// MatrixIterator
var MatrixIterator = class MatrixIterator {
  constructor(matrix) {
      this.x = 0;
      this.y = 0;
      this.matrix = matrix;
  }
  next(){
    if (this.x == this.matrix.width)
      return value = {done: true};
    let value = {x: this.x, y: this.y, value: this.matrix.get(this.x, this.y)};
    this.x++;
    if (this.x == this.matrix.width) {
      this.x = 0;
      this.y++;
    }
    return {value, done: false};
  }
}

// adding iterator to matrix Prototype
Matrix.prototype[Symbol.iterator] = function() {
  return new MatrixIterator(this);
}

// SymmetrixMatrix
var SymmetricMatrix = class SymmetricMatrix extends Matrix {
  constructor(size, content = (x, y) => undefined) {
    super(size, size, (x, y) => {
      if (x < y)
        return content(y, x);
      else return content(x, y);
  });

  set(x, y, value) {
    super.set(x, y, value);
      if (X != y) {
        super.set(y, x, value);
      }
  }
}

// invoking the new SymmetricMatrix class
var Matrix = new SymmetricMatrix(5, (x, y) => `${x}, ${y}`);


// Objects come from the object prototype, arrays from the Arary prototype and 
// functions from the Function prototype. 