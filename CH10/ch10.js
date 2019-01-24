    // - Modules

// A module is a modularized piece of a program that specifies which programs it
// depends on (dependencies) and what it offers to other programs (its interface).
// They have a lot in common with object interfaces in that they make part of the
// Module available to the rest of the world, while keeping their inner workings
// private

// The relationships between modules (dependencies) are stated in the Modules
// themselves, this can be used to figure out what dependencies need to be
// present for your module to work. It is not enough to put your javascript code
// in separate files as they still share the global namespace. Each module needs
// its own private scope. Otherwise they can intentionally or accidentally
// interfere with each other's bindings.

    // - Packages

// One of the main advantages of building a program out of separate pieces is
// that you will be able to apply it in different programs. While you can copy
// and paste code, this will quickly lead to too much work and effort in
// maintaining it among different uses. We can instead use packages which is a
// chunk of code that can be copied and installed, it contains one or more
// modules, and tells you which other packages depends on.

// Packages usually come with documentation so that people who didn't write the
// code can still understand it. npm is a package manager that does two things.
// First, it allows you to download and upload packages and it allows you to
// install and update packages, it also comes bundled with node js.

    // - Improvised Modules

// Before there was a built in module system in javascript, people would design
// module systems on top of javascript. You can use functions to create local
// scopes, and objects to represent module interfaces.

// This is a module for going between day names and numbers. It's interface
// consists of weekDay.number and weekDay.name. It also hides its local binding
// names inside the scope of its function that is immediately invoked.

const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number];},
    number(name) { return names.indexOf(name);}
  };
}();
console.log(weekDay.name(Weekday.number("Sunday")));
// -> Sunday

// This style of module does provide some isolation, but it does not declare
// dependencies. Instead it puts its interface into the global scope and it
// expects its dependencies to do the same.

    // - Evaluating data as code

// In order to make dependency relations part of the code, we'll have to take
// control of loading dependencies. Doing that requires us to excute strings as
// code. The most obvious way is to use the special operator eval, which will
// execute a string in the current scope. This is a bad practice as it violate
// the property of what scopes normally have, such as being easily predictable
// which binding a given name refers to.

const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// -> 2

// A better way of interpreting data is to use the Function constructor. This
// takes two arguments: a string containing a comma separated list of argument
// names and a string containing the function's body.

let plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// -> 5

// This is precisely what we need for a module system. We can wrap that module's
// code in a function and use that function's scope as module scope.

      // - CommonJS

// The most widely used approach to bolted-on JS modules is called commonJS
// modules. The main function in CommonJS is a function called require. When
// you call it with the module name of a module dependency, it makes sure it is
// loaded and it returns its interface. The loader wraps the module code in a
// function, which ensures their own local scope. So all that is requried of the
// caller if to put their interface in the object bound to exports.

// In this example we use two packages from npm, ordinal, which converts numbers
// to strings like "1st", "2nd", etc., and date-names, which gets the english
// names for weekdays and months. It exports a single function, formatDate,
// which takes a Date object and a template string.

const ordinal = require("ordinal");
const {days, months} = require("date-names");

// The ordinal package returns a single function, while date-names returns
// multiple things, which we store in a object with two properties.

exports.formatDate = function(date, format) {
    return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
      if (tag == "YYYY") return date.getFullYear();
      if (tag == "M") return date.getMonth();
      if (tag == "MMMM") return months[date.getMonth()];
      if (tag == "D") return date.getDate();
      if (tag == "Do") return ordinal[date.getDate()];
      if (tag == "dddd") return days[date.getDay()];
    });
};

// The require function in its most simple form looks something like this:
require.cache = Object.create(null);

function require(name) {
  if (!(name in require.cache)) {
      let code = readFile(name);
      let module = {exports: {}};
      require.cache[name] = module;
      let wrapper = new Function("require, exports, module", code);
      wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}

    // ECMAScript Modules

// Several problems with CommonJS include the fact that exports are not available
// in your local scope. And because require is a normal function call taking any
// kind of argument, not just a string literal, it can be hard to determine the
// dependencies of a module without running it.

// Therefore, Javascript has created its own module system called ES modules.
// They can be run like so:

    import ordinal from "ordinal";
    import {days, months}  from "date-names";

    export function formatDate(date, format) { /*...*/};

// The export keyword can export functions, classes, or binding definitions
// (let, const, or var). An ES module's interface is not a single value, but
// a set of named bindings. When there is a binding named default, it is treated
// as the module's main exported value. When you import a module without braces,
// you get its default binding.


    // Building and bundling

// A lot of programs are written using an extension of JS, such as typescript,
// these programs are transcompiled to JS. Fetching many files, especially
// big files takes a lot of time, therefore, they are bundled together using
// tools like webpack. Also, programs are compressed using minifiers that remove
// whitespaces and comments.


    // Module design

// Good module design involves using simple and predictable interfaces. This
// may include following existing conventions. Eg. ini module imitates the JSON
// object by providing stringify and parse. You can also use simple data
// structures and focus on doing one thing at a time. Focused modules also gives
// your module more applicability. When possible use a function over objects.
