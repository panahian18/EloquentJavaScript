    // Modules

// A module is a piece of software that specifies which programs it relies on
// (its dependencies) and how it can be used by other programs (its interface).
//  They have a lot in common with object interfaces in that they allow the
// rest of the world to use the program while still keeping its inner workings
// private.

// The relationships between moduels (dependencies) are stated in the modules
// themselves, they are needed to know which programs are needed to make your
// module work. It is not enough to put your modules in separate files because
// they still share the same global scope. Each module needs its own private
// scope otherwise they can intentionally or accidentally interfere with Each
// other's bindings.

    // Packages

// One of the advantages of modularizing programs is that you can use it in
// other programs. While you can just copy and paste code, this can quickly
// become tiring and inefficient. Therefore, packages, which are bundles of
// one or more modules are used in order to faciliate code reuse.

// Packages come with documentation, which are descriptions of the program so
// that people who didn't write the program can still use the program. npm,
// which stands for node package manager, does two things. First, it installs
// and uploads packages, and it installs and updates packages.

    // Improvised packages

// Before there were module systems in JS, people would create their own module
// systems by using advantage of function scopes to create local scopes, and they
// would use objects to represent module interfaces.

// Here is a module for going between day names and numbers. It's interface
// consists of weekDay.number and weekday.name. It also hides its local
// binding names inside the scope of its function that is immediately invoked.

const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number]};
    number(name) { return names.indexOf(number)};
  };
}();

console.log(weekDay.name(WeekDay.number("sunday")));
// -> sunday

// This style of module system does provide some isolation but it does not
// declare dependencies, it instead puts its interface in the global scope and
// and it expects dependencies to do the same.

    // Evaluating data as code

// In order to handle depencies, we have to take control of loading dependencies.
// Doing that requires us to execute strings as code. We can do this using eval,
// however, this violates the principle of keeping keeping a separate scope. This
// means that it will not be predictable which binding a given name refers to.

const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturn("x = 2"));
// -> 2;

// A better way is to use the function constructor, which takes a comma separated
// string, which represents the arguments and a second argument which is the code
// that will go in the body of the function. This will allows us to use the scope
// of the function to provide us with the separation of code that we need to
// instantiate modularity.

let plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// -> 4;

  // CommonJS

// This is a bolted approach to handling JS modules that simply has a require
// function that takes the dependency name and returns the interface of the
// dependency. When you call it, it makes sure that the dependency is wrapped in
// the scope of a function. This is done by the loader function, so that all that
// is required by someone writing a module is to put the interface in the object
// bound to exports.

// In this example, we have 2 dependencies, ordinal and date-names. We then bind
// our interface to the exports object.

const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formateDate = function (date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal[date.getDate()];
    if (tag == "dddd") return days[date.getDay()];
  });
};

// The require function that wraps and loads our modules.

require.cache = Object.create(null);

function require(name) {
  if (!(name in require.cache) {
  let code = readFile(name);
  let module = {exports: {}};
  require.cache[name] = module;
  let wrapper = new Function ("require, exports, module", code);
  wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}

    // ECMAScript Modules

// Two problems with CommonJS is that the exports are not available in your
// local scope. And because a require is a normal function call so it can take
// any kind of argument, not just a strings literal, it can therefore be hard
// to determine the dependencies of a module without running it.

// Javascript has its own module system called ES modules. For example,

import ordinal from "ordinal";
import {days, months} from "date-names";

export function formateDate(date, format) {/*...*/};

// The export keyword can export functions, classes or binding definitions
// (let, const, or var). An ES module's interface is not just a single value
// but a set of named bindings. When there is a binding named default, it is
// treated as a module's main exported value. When you import a module without
// braces, you get its default binding.

    // Building and Bundling

// A lot of programs are written in different variations of JS like TypeScript,
// these programs are transcompiled to JS. Fetching many files, especially big
// files takes a lot of time, therefore, they are bundled together using webpack
// Also many programs are compressed using minifiers that remove whitespaces and
// comments.

    // Module design

// Good module design involves using simple and predictable interfaces. This may
// include following existing conventions. Eg. ini module imitatest the JSON
// object by providing stringify and parse. You can also use simple data structures
// and focus on doing one thing at a time. Focused modules also gives your modules
// more applicability. When possible use functions over objects.
