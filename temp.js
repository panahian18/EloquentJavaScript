    // Modules

// A module is a piece of program that specifies what programs depend on it
// (dependencies) and what it offers to other programs (its interface). They have
// have a lot in common with object interfaces in that they make part of the module
// available to the rest of the world, while keeping their inner workings private.

// The relationships between modules (dependencies) is stated in the modules
// themselves, this can be used to figure out what modules are needed to make your
// module work. It is not enough to put your js code in separate files as they still
// share the global namespace. Each module needs its own private scope. Otherwise
// they can intentionally or accidentally interfere with each other's binding.

    // Modules 5:13

// A module is a modularized piece of code that specifies which mother moduels it
// depends on (dependencies) and what it offers to other programs (its interface)
// They have a lot in common with object interfaces in that they make part of their
// module available to the rest of the world, while keeping their inner workings
// private.

// The relationships between modules (dependencies) are stated in the Modules
// themselves, this can be used to figure out what dependencies need to be present
// for your module to work. It is not enough to put your JS code into separate
// files as they still share the same global scope. Otherweise, they can itnetionally
// or accidentally interfere with each other's bindings.

    // Packages

// One of the main advantages of modularization is the ability to use it in many
// different applications, this prevents us from copying and pasting code, as this
// involves too much work and effort in maintaining it among differnt users as
// one change in the main module can affect many different applications. Instead,
// we can use packages which can be copied and installed, it contains one or more
// modules, and tells you what other packages it depends on.

// Packages usually come with documentation so that people who didin't write the
// code can still understand it. npm is a package manager that does two things.
// It allows you do install and download packages, it also comes bunlded with
// node js.

    // Improvised Modules

// Before modules were built-in in javascript, people would design module systems
// on top of javascript. You can use functions to create local scopes, and objects
// to represent module interfaces.

// This is a module for going between day names and numbers. It's interface
// consists of weekDay.number and weekDay.name. It also hides its local binding
// names inside the scope of its function that is immediately invoked.

// Here we use a function to keep the local bindings hidden from the outside
// world, while we return an object that contains the functions that are the
// interface of the module. The function is immediately invoking so it is as if
// the function doesn't exists from the user's point of view.Tracker: 1
const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number]};
    number(name) { return names.indexOf(name)};
  };
}();
console.log(weekDay.name(Weekday.name(Weekday.number("Sunday"))));
// -> Sunday

// This type of module does provide some isolation, but it does not declare any
// dependencies, instead it put its interface into the global scope and it
// expects its dependencies to do the same.

    // Evaluating data as code 6:21 - 6:51

// In order to make dependency relations part of the code, we'll have to take
// control of loading dependencies. Doing that requires us to execute strings of
// code. The most obvious way is to use the special operator eval, which will
// execute a string in the current scope. This is bad practice as it violates
// the property of what scopes normally have, such as being easily predictable
// which binding a given name refers to.

const x = 1;
function evalAndReturnX(code) {
  eval(code);
  retunr x;
}

console.log(evalAndReturnX("var x = 2;"));
// 2;

// A better way of interperting data is to use the Function constructor, which
// takes two arguments, a string containing a comma separated list of arguments,
// and a string containing the function's body.

let plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// -> 5

// This is precisely what we need for a module system, we can wrap that module's
// code in a function and use that function's scope as module scope.

    // CommonJS

// The most widely used approach to bolted-on JS modules is called commonJS modules.
// The main function in commonJS is a function called require. When you call it
// with the module name of a module dependency, it makes sure it is loaded and
// returns its interface. The loader wraps the module code in a funciton, which
// ensures their own local scope. So that all that is required of the caller is to
// put their interface in the object bound to exports.

// In this example, we use two packages from npm, ordinal, which converst numbers
// to strings like "1st", "2nd", etc, and date-names, which gets the english
// names fro weekdays and months. It exports a single function, formatDate, which
// takes a Date object and a template string.

const ordinal = require("ordinal");
const {days, months} = require("date-names");

// The ordinal package returns a single function, while the date-names retunrs
// multiple things, which we store in an object with 2 properties.

exports.formatDate = function(date, format) {
    return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
      if (tag == "YYYY") return date.getFullYear();
      if (tag == "M") return date.getMonth();
      if (tag == "MMMM") return months[date.getMonth()];
      if (tag == "D") return date.getDate();
      if (tag == "Do") return ordinal[date.getDate()];
      if (tag == "dddd") return days[daffte.getDay()];
    });
};

// The require function in its most simple form looks like this:
require.cache = Object.create(null);

function require(name) {
  if (!)
}

    // Improvised modules

// Before there was a built-in module system in javascript, people would design
// module systems on top of javascript. You can use functions to create local
// scope and objects to represent module interfaces.

// This is a module for going b/w day names nad numbers. It's interface consists
// of Weekday.number and weekday>name. it also hides its local binding names
// inside the scope of its function that is immediately invoked.

const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[numnber]};
    number(name) { return names.indexOf(name);}
  };
}();
console.log(weekDay.name(Weekday.number("Sunday")));

// This style of module does provide some isolation, but it does not declare
// any dependencies. Instead it puts its interface into the global scope and it
// expects its dependencies to do the same.

    // Evaluating data as code

// In order to make dependency relations part of the code, we'll have to take
// control of loading dependencies. Doing that require us to execute strings as
// code. The most obvious way is to use the special eval operator eval, which
// will execute a strin gin the current scope. This is considered bad practice
// as it violates the property that scopes normally have, such as being easily
// predictable which binding a given name refers to.

const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// -> 2

// A better way of interpreting data is to use a function constructor, which
// takes 2 arguments, a comma separated list of argument names, and a string
// containing the function's body.

let plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// -> 5

// This is exactly what we need for a module system. We can wrap that module's
// code in a function and use the function's scope as module scope.

    // CommonJS

// The most widely used approach to bolted-on JS modules is called commonJS
// modules. The main function in commonJS is a function called require. When
// you call it with the module of a module dependency, it makes sure it is
// loaded and it returns its interface. The loader wraps the module code in a
// function, which ensures its own local scope. So all that is required of
// the caller is to put their interface in the object bound to exports.

// In this example we use tweo packages from npm, ordinal, which converts numbers
// to strings list "1st", etc. and date-names which gets the english name for
// weekdays and months. It exports a single function, formatDate, which takes
// a Date object and a template string.

const ordinal = require("ordinal");
const {days, months} = require("date-names");

// The ordinal package returns a single function, while date-names returns
// multiple things, which we store in a single object with two properties.

exports.formateDate = function(date, format) {
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

//1:44
function require(name) {
    if (!(name in require.cache)) { // see if we have already loaded the file
      let code = readFile(name);  // use a utility to read code and transform it into a string
      let module = {exports: {}};
      require.cache[name] = module; // load the empty module into cache
      let wrapper = new Function("require, exports, module", code); // wrap the function so that it has its own local scope
      wrapper(require, module.exports, module); // Now the require function is called again, however by defining the three parameters and passing the relevant arguments, the loader (require) ensures that the function has the relevent arguments if needed.
    }
    return require.cache[name].exports;
  }

    // ECMAScript Modules

// Several of the porblems of commonJS include the fact that exports are not
// available in your local scope, and because require is a normal function call
// taking any kind of argumrnt, not just a string literal it is hard to know what
// a module's dependencies are without running it first.

// Therefore, JS created its own module system called ES modules, they can run like so:

import ordinal from "ordinal";
import {days, months} from "date-names";

export function formatDate(date, format) { /*...*/};

// The export function can export functions, classes, or binding definitions e.g.
// (let, const, or var). An ES module's interface is not a single value but a
// set of named bindings. 2:30-3:00. When there is a binding named default, it is
// treated as the module's main exported value. When you import a module without
// braces, you get its default binding.

    // Building and bundling

// A lot of programs are written using an extension of JS, such as Typescipt,
// these programs are transcompiled to JS. Fetching many files, especially big
// files takes a lot of time, therefore, they are bundled together using programs
// like webpack. Also, programs are compressed using minifers that remove whitespaces
// and comments.

    // Module design

// Good module design involves using simple and predictable interfaces. This may
// include following existing conventions. E.g. ini module imitates the JSON
// object by providing stringify and parse. You can also use data structures and
// focus on doing one thing at a time. Foucsed modules also gives your module
// more applicability. When possible use a function over objects.


    // Chapter 9 - Regular Expressions

// RegExp can be made be using either of two notations:

let re1 = new RegExp("abc");
let re2 /abc/;

// In the second case, forward slashes have a special value, so in order to use
// them, we would have to escape them with a backslash. Also, backslashes that
// aren't part of a specific code will be perserved unless they are part of a
// special code, e.g. /n. Certain characters have a special meaning in regex, eg.
// ?, so they must be escaped to be used literally.

// Regex have a number of methods, one is test, where given a string, it will
// return a boolean depending if the string matches:

console.log(/abc/.test("abcde"));
// true

    // Matching a set of characters 4:45

// Putting a regex between a set of square brackets means to match any of the
// characters in it. There are certain character shortcuts that character groups
// have, e.g. /d means the same as [0-9]. These can also be used in [].

console.log(/[0-9]/.test("in 1992"));
// -> true

console.log(/[/d]/.test("in 1992"));

// We can also use negation in RegExp
let notBinary = /[^01]/;
console.log(notBinary.test("010101"));
// -> false

    // Repeating parts of a pattern

// Putting a plus sign after something in regex means that it can be matched
// one or more times.
console.log(/'\d+'/.test("123"));

// Putting a * after something in regex means that it can be matched as many
// times as possible. Putting a ? means its optional.
console.log(/'\d*'/.test(123));
console.log(/'\d?'/.test(123));

// Putting a set of characters between a set of brackets means that any of the
// characters may match.
console.log(/[0-9]/.test("123"));

// To indicate that a pattern should be matched a specific number of times, put
// a number in curly braces, e.g. {4}.
let dateTime = /\d{1,2}-\d{1,2}/;
console.log(dateTime.test("30-1"));

    // Grouping Subexpressions

// To use an operator like * or ? on more than one character at a time you can
// use parantheses
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying).test("BoohooooohooHOO");
// -> structures
// Note the i at the end makes the entire expression case insensitive

    // Matches and groups

// The best way to match is with test, which returns a boolean, otherwise you
// can use exec, which will return null or an object containing info on match.
// The object will return the index property that tells us where in the string
// the match begins. Strings also have a match method that behaves similarily.
console.log("one two 100".match(\/d+/));
// -> ["100"]
console.log(match);
// -> "100"
console.log(match.index);
// -> 8

console.log("one two 100".match(/\d+/));
// -> ["100"]

// When the regex has subexpressions, the whole match is the first element in the
// returned object from exec. The first match is then followed by the matches to
// the subexpressions.
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// -> ["'hello', "hello"]

    // The Date Type

// Javascript has a standard object type for representing dates
// You simply create a new date and you get the current date and time.
console.log(new Date());

// You can also create a specific date for a new Date object, months start at 0
// but days start at 1
console.log(new Date(2018, 4, 2));

// The time stamps are stored as the number of milliseconds since 1970
console.log(new Date(2013, 11, 19).getTime());
// -> 1231231233

// we can use subexpressions to parse a string date and return a date object
function getString(string) {
  [_, day, month, year] = /(\d{1,2})-(\d{1,2})-(\d{4}))/.exec(string);
  return new Date(year, month-1, day);
}

// A problem with getString is that it can start anywhere in the string, giving
// us garbage values. So we can either use "^" to denote the start of a string
// and we can use $ to denote the end of a string, e.g. /^\d+$/ is any string
// with one or more digits. We can also use word boundaries to denote beginnings
// and endings of strings.

 console.log(/cat/.test("concatenate"));
 // -> true
 console.log(/\bcat\b/.test("concatenate"));
 // -> false

    // Choice Patterns

// If we wanted to know whether a string contains a number and is followed by
// one of three words then we can write 3 regexs or we can use the OR operator (|)

let animalCount = /\b\d+ (pig|cow|chicken|)s?\b/;
console.log(animalCount.test(15 pigs));
// -> true
console.log(animalCount.test("15 pigchickens"));
// -> false

    // Backtracking

// /\b([01]+b|\d+[\da-f]+h)\b/ This expression will match a binary string, followed
// by a b character, or one ore more digit with no suffix plus an h, or strings
// of a digits and characters between a-f, followed by an h. If given the string
// 103, it attempts the first branch, but upon reaching the number 3, it realizes
// that it's at the wrong branch and backtracks to the beginning (it remembers)
// the start position.

    // Replace method

// Strings have a method replace that given a string, it replaces a value for
// another value.
console.log("papa".replace("a", "b"));
//-> pbpb
// 7-9 regex, 9-10, 10-12 ch. 11
// We can also use regex, also we can add g to the end of a regex, which denotes
// global, which will replace all matches not just the first.
console.log("borobudur".replace(/[ou]/g, "a"));

console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip".replace(/(\w+). (\w+)/g, "$2, $1"));

// The $1 and $2 in the example above denote the groups in the pattern that was matched.

// You also pass a function in the replace method instead of a string in the second
// argument. The function will be called with the matched groups and the whole
// match, and it will return a new string.
let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/), str => str.toUpper());
// ->  the CIA and FBI

    // Greed

// A lof of regex operators are greedy in that they try to match as much as they can
// before backtracking. By placing a ? after them they become non-greedy, e.g.:

// Greedy version of commentStripper
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g. "");
}

// This will match the entire string before backtracking and finding an occurance
// of */. By placing a ? after the repitition operator, it will match as little
// as possible, only backtracking when it doesn't make sense.

// Non-greedy version of comment stripper
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}

    // Dynamically Creating RegExp Objects

// There are cases when you don't know the exact pattern you want to match
// against. E.g. if you want to look for a user's name in a piece of code and
// enclose it in underscores.
let name = "harry";
let text = "Harry is a suspicious character";

// In this regexp, since we are creating a string, the \b needs to be escaped by
// a \. Also, the gi represents the options, in this case global and case-insensitive.
let regexp = new regexp("\\b(" + name + "\\b)", "gi");
console.log(text.replace(regexp, "_$1_"));

// In case the name is something weird like "dea+hl[]rd", we can escape anything
// that's not an alphanumeric character or a white space.
let name = "dea+hl[]rd";
let text = "This dea+hl[]rd guy is super annoying.";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp = new regexp("\\b" + escaped + "\\b", "gi");
console.log(text.replace(regexp, "_$&_"));

    // The Search Method

// The indexOf method on strings cannot be called with a regular expression.
// But there is another method, search, that does expect a regular expression.
// Like lastIndex, it does return the first index on which the expression was
// found, or -1 when it wasn't found. Note: there is not way to indicate that
// the match should start at a given offset.

console.log("  word".search(/\s/));
// -> 2
console.log("word".search(/\s/));
// -> 1

    // The lastIndex Property

// Regular expression objects have properties, one such is source, which contains
// the strings that the regex was created from. Another is lastIndex, which contols,
// in  a limited way, where the next match will start. To use lastIndex, the regex
// the regex must have the global (g) and sticky (y) options enabled, and the match
// must happen through the exec method.

    // Looping Over Matches

    // Parsing an INI File

// Second Review

// RegExp can be made using either of 2 notations:
let re1 = new RegExP("abc");
let re2 = /abc/;

// In the second notation, forward slashes have a special use, so in order to
// use them in our regex, we must escape them with a backslash. Also, backslashes
// that aren't part of a special code will be preserved unless they are part of
// a special code, e.g. \n. Certain characters have a special meaning in regex
// eg. ?, so they must be escaped to be used literally.

// Regex have a number of methods, one is test, where given a string, it will
// return a boolean depending if the string matches.

console.log(/abc/.test("abcde"));
// true

    // Matching a set of characters

// Putting a regex between a pair of square brackets means to match any of the
// characters in it. There are certain special shortcuts that character groups
// have, e.g. \d means the same as [0-9]. These can also be used in []. We also
// have: \w (any word character), \s (any whitespace, e.g. new line, space, tab),
// and the capital versions are their negation, e.g. \W

console.log(/[0-9]/.test("in 1992"));
// -> true

// We can also use negation in RegExp
let notBinary = /[^01]/;
console.log(notBinary.test("0101010"));
// -> false

     // Repeating parts of a pattern

// Putting a plus sign after something in regexp means it can be matched one or
// more times.
console.log(/\d+/.test("123"));
// -> true

// Putting a * after something in regex means it can be matched as many times
// as possible. Putting a ? means matching is optional (zero or more times).
console.log(/\d?/.test("123"));
// true
console.log(/\d*/.test(""));
// true

// To indicate that a pattern should match a specific number of times, the
// number must be placed in curly braces e.g. {4}.
let dateTime = /\d{1,2}-\d{1,2}-\d{4}-\d{1,2}:\d{2}/;
console.log(dateTime.test("30-1-2003 8:45"));

    // Grouping Subexpressions

// To use an operator an like * or ? on more than one character at a time you
// can use parantheses.
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohooooohooo");
// -> true
// Note: the i at the end of the regex indicates that it is case-insenstive.

    // Matches and groups

// The best way to use test, which returns a boolean, otherwise you can use exec
// which will return null or an object with info on the match. The object will
// return the index property that tells us where in the string the match begins.
// Strings also have a match method that behaves similarily.
let match = "one two 100".match(/\d+/);
// -> ["100"]
console.log(match.index);
// -> 8

// exec(regex) and match(strings) are similar functions
console.log((/\d+/.exec("one two 100"));
// -> ["100"];

// When the regex has subexpressions, the whole match is the first element in
// the match, then the matches from the subexpression. However, only the first
// part matched by the group ends up being shown.
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// -> ["'hello'", "hello"]

    // The Date Type

// Javascript has a standard object type for representing dates. You simply
// create a new Date and you get the current date and time.
console.log(new Date());

// You can also create a date form a specific date, months start at 0 but days
// start at 1
console.log(new Date(2018, 4, 2));

// Time stamps are stored as the number of milliseconds since the start of 1970
console.log(new Date(2013, 11, 19).getTime());
// 123123123

// We can also use subexpressions to parse a date and return a date object
function getString(string) {
  [_, day, month, year] = /(\d{1,2})-(\d{1,2})-(\d{4}))/.exec(string);
  return new Date(year, month-1, day);
}

// A problem with getString is that it can start anywhere in the string, so it
// can return garbage values. We can use either "^" to denote the start of a
// string and we can use $ to denote the end of a string, e.g. /^\d+$/ is any
// string with one or more digits. We can also use word boundaries (\b) to denote
// beginnings and endings of strings.

console.log(/cat/.test("concatenate"));
// -> true
console.log(/\bcat\b.test("concatenate"));
// -> false

    // Choice Patterns

// If we wanted to know whether a string contains a numnber and is followed by
// one of three words then we can write 3 regexs or we can use the OR operator.

let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs"));
// -> true
console.log(animalCount.test("15 pigchickens"));
// -> false

    // Backtracking

// /\b([01]+b|\d+|[\da-f]+h)\b/. This is an expression that will match with a binary
// string followed by a b, or a digit with no suffix or a string consisting of
// either a number or a letter from a to f, followed by a h, denoting a hexadecimal.
// If given the string 103, it attempts the first branch, but at digit 3, it
// realizes that it is in the wrong branch and bracktracks, it does this because
// it remembers its place before each branch.

    // Replace method

// Strings have a method replace, that given a string, replaces a value for
// another value.
console.log("papa".replace("a", "b"));
// -> pbpb

// We can also use regexes in the replace method, also, we can can add a "g" to
// the end of a regex, which will replace all matches not just the first.
console.log("borobudur".replace(/[ou]/g, "a"));

console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip".replace(/(\w+), (\w+)/g, "$2 $1"));
// The $1 and $2 denote the groups in the pattern that was matched.

// You can also pass a function instead of a string in the second argument in
// replace. The function will be called with the matched groups and the whole
// match, and will be returned in a new string.

let s = "the cia and the fbi";
console.log(s.replace(/\b(fbi|cia)\b/), str => str.toUpper());

    // Greed

// A lot of regex operators are greedy in that they try to match as much as they
// can before Backtracking. By placing a ? after them they become non-greedy.

// Greedy version of commentStripper, note: in the second half of the regex, we
// use [^]* instead of .*, because block comments may span more than one line
// and the .* character represents anything excepts newlines.
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}

// This will match the entire string before backtracking and finding an occurance
// of */

// Non-greedy version of commentStripper
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}

    // Dybamically Creating RegExp objects

// There are cases when you do not know the exact pattern you want to match
// against. E.g. if you want to look for a user's name in a piece of code and
// enclose it in underscores.
let name = "harry";
let text = "Harry is a suspicious character";
// In this regexp, since we are creating a string, the \b needs to be escaped by
// a \. Also, gi represents the options, in this case global and case-insensitive.
let regexp = new regexp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// -> _Harry_

// In a case where the name is something weird like "dea+hl[]rd", we can escape
// anything that's not an alphanumeric character or a white space.
let name = "dea+hl[]rd";
let text = "This dea+hl[]rd guy is super annoying.";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text.replace(regexp, "_$&_"));

    // The Search Method

// The indexOf method cannot be called with a regular expression. But there is
// another method, search, that does expect a regular expression. Like indexOf,
// it returns the first index on which the expression was found, or -1 if it isn't
// Note: there is no way to indicate that the match should start at a given offset.

console.log("  word".search(\/s/));
// -> 2
console.log("   ".search(/\S/));
// -> -1

    // The LastIndex Property

// Regular expression objects have properties, one such property is source, which
// contains the string that expression was created from. Another is lastIndex,
// which controls, in a limited way, where the next match will start. To use
// lastIndex, the regex must have the global(g) and sticky (y) options enabled
// and the match must happen through the exec method.

let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");
console.log(match.index);
// -> 4
console.log(pattern.lastIndex);
// -> 5

// If the match is successful, the index gets increased by one, if not then it
// is set to 0, which is its default value. If it is called with sticky flag, then
// it will only match if it starts directly at lastIndex, whereas for global, it
// will search ahead for a position where a match can start.

let global = /abc/g;
console.log(global.exec("xyz abc"));
// -> ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// -> null

// One common problem which can occur with reusing regexp is that they will
// change the lastIndex property which will cause errors when using exec again.

// An effect with global is that it changes the way method works for strings, instead
// of returning an object similar to exec, it returns an array of all matches
// instead of just one. Global regular expressions should therefore only be used
// when necessary - calls to replace and places where you want to explicitly use
// lastIndex


    // Looping over Matches

// A common pattern is to loop over all occurances of a pattern in a string in
// a way that gives us access to the match object in the loop body, by using
// lastIndex and exec.

let input = "A string with 3 numbers in it.. 42 and 88.";
let number = /\b(\d+)\b/g;
let match;
while (match = number.exec(input)) {
  console.log("There is a match:", match[0], "at", match.index);
}

let input = "A string with 3 numbers in it.. 42 and 88.";
let number = /\b(\d+)\b/g;
let match;
while (match = number.exec(input)) {
  console.log("There is a match:", match[0], "at", match.index);
}

  // Parsing an INI File

// We have the following INI file, which is a windows configuration file:
searchengine=http://www.google.com/search?q=$1
spitefulness=9.7
; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451
[gargamel]
fullname=Gargamel
type=evil sorcerer
outputdir=/home/marijn/enemies/gargamel

// We want to convert a string into an object who's properties hold strings for
// sectionless settings and sub-objects for settings, with those objects holding
// section's settings.

// We first split the string into lines by the newline separator or /r then /n

function parseINI(string) {
  // start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split()
}

    // Chapter 11 - Asyncrhonous JavaScript

// Previous examples were programs that were executed synchronously, that is,
// they were executed one at a time, however if a program has to access a part of
// the computer that is not the processor, then it will make the processor sit
// idle. Your operating system will then use this idle processor to handle other
// tasks, however, we want our program to take advantage of this idling for own
// program.

    // Asynchronicity

// In an asyncrhonous program, when an action is started, the program continues
// to run, a when the action finishes, then the program is informed and gets the
// results.

// Consider a program that fetches two resources from a network, then combines
// the results. In a synchronous program the fetches are retrieved
// consecutively. This is very inefficient, so the solution to this is to have
// two threads of control.

// In an asyncrhonous model, starting a network action conceptually causes a
// split in the timeline. The program that initiated the action continues
// running and the action happens alongside it, notifying the program when it is
// finished.

    // Callbacks

// One approach to asynchronous programming is to take a slow function and give
// it an extra argument, a callback function. The action starts and when it
// finishes the callback function is called with the result. setTimeout waits a
// few miliseconds and then calls a function.

setTimeout(() => console.log("Tick"), 500);

// We can chain multiple callback functions for functions that require time to
// complete their action. Ex. fetching data from the data source takes some time.

import {bigOak} from "crow-tech";

bigOak.readStorage("food caches", caches => {
  let firstCache = caches[0];
  bigOak.readStorage("firstCache", info => {
    console.log(info);
  });
});

// Imagine we can send messages between two points of communication, this means
// that we can send request-response pairs. One node sends a message to another
// node which then immediately sends a message back, confirming receipt and possibly
// including a response. Each message has a type, which determines how it is
// handled, this means there are handlers for each type of message.

// The bigOak has a send method, that takes the name of the nest, type and mes.
// and a function to call when a response comes in (callback function).
bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
  () => console.log("Note Delivered");

// In order to make the above work, we need to define a request type named "note",
// The defineRequestType function defines a new type of request and implements
// a handler. Our implementation simply calls console.log.

import {defineRequestType} from "crow-tech";

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

// done() is a callback function that it must call when it is done with the
// request. We could have used the functions return value as a response, but then
// it wouldn't be asynchronous. So we need another function (in this case done())
// to let us know when it is finished.

import {defineRequestType} from "crow-tech";

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

// done() is a callback function that it must call when it is done with the
// request. We could have used the function's return value as a reponse, but then
// it wouldn't be asynchronous. So we need another function (in this case done())
// to let use know when it is finished.

    // Promises

// A promise is an action that may complete at some point and produce a value.
// Instead of arranging for a function to be called when our function is finished
// executing, we could instead return an object that represents this future value.
// A promised value might already be there or it might appear at some point in the
// future, computations on promised values execute async. as they become available.

// The easiest way to create Promise is by calling Promsie.resolve and passing
// a value, it will wrap your value in a promise and return it.

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// -> Got 15

// A promise is an action that may complete at some point and produce a value.
// Instead of arranging for a function to be called when our function is finished
// executing, we could instead return an object that represents this future value.
// A promised value might already be there or it might appear at some point in the
// future, computations on promised values execute async as they become availiable.

// The easiest way to create a Promise is by calling Promise.resolve and passing
// a value, it will wrap your value in a promise and return it.

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// -> Got 15

// .then() returns the result of the promise. It registers a callback to be called
// when the promise resolves and produces a value. It also returns another promise
// which resolves to the value that the handler returns. If the handler returns
// a promise then it waits for that to resolve and resolves to its promise.

// To create a promise, you can use the constructor, which expects a function as
// an argument, which it immediately calls, passing it a function that it can
// use to resolve the promise.

// Example for our readStorage function

function storage(nest, name) {      // Our new storage function that will return a promise
  return new Promise(resolve => {  //  Here we create a new promise using the constructor, we pass a function for it to call
    nest.readStorage(name, result => resolve(result)); //  we pass the function resolve, which it
  });
}

storage(bigOak, "enemies").then(value => console.log("Got", value));
}
// Here we define a new operation that we can perform with our nodes, this function
// happens to return a promise. The promise is made using the promise constructor,
// this expects a function, which it will be wrapping in a promise, it therfore calls
// it immediately, this function in turn must be passed the resolve method from
// the Promise class, this is how the promise knows that it is resolved, with the
// value that is used as an argument.

        // Failure

// Async functions need a method for throwing exceptions when they fail, similar
// to regular functions. Making sure failures are properly reported with callback
// functions is extremely difficult, such callbacks must ensure if they have
// received exceptions or if any functions they call throw exceptions.

// Promises make this simple. They can either be resolved (action is successful)
// or rejected (failure). Resolve handlers (registered with then) are only called
// when the action is successful, and rejections are automatically propagated to
// the new promise produced by then. When a handler throws an exception, this
// automatically causes the promise produced by its then call to be rejected.

// So if any element in a chain of asynchronous actions fails, the outcome of the
// whole chain is marked as rejected, and no handlers are called thereafter.
// Rejecting a promise provides a value of rejection, also called the reason of
// rejection. When a handler function throws an exception, that is the reason.
// When a handler returns a promise that is rejected, that rejection flows into
// the next promise.

// Promise.reject creates a new, immediately rejected promise.

// Promises come with a function called catch, that registers a handler that is
// called when the promise is rejected, similar to how then handles normal
// resolutions. It also returns a new promise, which resolves to the original
// promise's value if it resolves normally, and to the result of the catch
// handler otherwise.

new Promise((_, reject) => reject(new Error("Fail")))
    .then(value => console.log("Handler 1"))
    .catch(reason => {
        console.log("vaught failutre" + reason);
        return "nothing";
    })
    .then(value => console.log("Handler2, value"));

// A promise is an action that may complete at some point and produce a value.
// Instead of arranging for a function to be called when our function is finished
// executing, we could instead return an object that represents this future value.
// A promised value might already be there or it might appear in some point in
// the future. Computations on promised values execute async. as they become available.

// The easiest way to create a Promise is by calling Promise.resolve and passing
// a value, it will wrap your value in a promise and return it.

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// -> Got 15

// .then() is used to register a handler to a promise so that when it resolves,
// the handler gets called with the value of the result. It also returns another
// promise which resolves to the value that the handler resolves to. If that
// promise returns a promise then it waits for that to resolve then resolves to
// its value.

// To create a promise, you can use the constructor, which expects a function
// as argument, which it immediately calls, passing it a function that it can
// use to resolve the promise.

// Example for our readStorage function

function storage(nest, name) {
    return new Promise(resolve => {
        nest.readStorage(name, result=>resolve(result));
    });
}

storage(bigOak, "enemies")
    .then(value => console.log("Got", value));

    // Failure

// Async functions need a method for throwing exceptions when they fail, similar
// to regular functions. Making sure failures are properly reported with callback
// functions is extremely difficult, such callbacks must ensure they have received
// exceptions or if any functions they call throw exceptions.

// Promises make this simple. They can either be resolved (action is successful)
// or rejected. Resolve handlers are only called when the action is successful, and
// rejections are automatically propragated to the new promise returned by then.
// When a handler throws an exception, this automatically causes the promise
// produced by its then call to be rejected.

// So if any element in a chain of asynchronous actions fails, the outcome of the
// whole chain is marked as rejected, and no handlers are called thereafter.
// Rejecting a promise provides a value of rejection, also called the reason of
// rejection. When a handler function throws an exception, that is the reason.
// When a handler returns a promise that is rejected, that rejection flows into
// the next promise.

// Promise.reject creates a new, immediately rejected promise.

// Promises come with a function called catch, that registers a handler that is
// called when the promise is rejected, similar to how then handles normal
// resolutions. It also returns a new promise, which resolves to the original
// promise's value if it resolves normally, and to the result of the catch
// handler if it is rejected.

// As a shorthand, .then() accepts a rejection handler as a second argument. The
// Promise constructor accepts a rejection function as a second argukent, which
// it can use to reject the new promise. Chains of promises can be created by
// calls to then and catch. Javascript environements can tell when a promise
// rejection isn't handled and will report this as an error.

new Promise((_, reject) => reject(new Error("Fail")))
    .then(value => console.log("Handler 1"));
    .catch(reson => {
        console.log("Caught failure " + reason);
        return "nothing";
    })
    .then(value => console.log("Handler 2", value));

        //  Async functions

// Imagine we want to store information of each node in every node

// Functions that use promises can still be difficult to understand. It would
// be a lot easier to write async code synchronously, JavaScript allows us to
// do this using the "async" keyword. An async function returns a promise and in
// its "await" will "await" other promises in a way that looks synchronous.

requestType("storage", (nest, name) => storage(nest, name));  // create a new request type

function findInStorage() {
    return storage(nest, name).then(found => {
        if (found != null) return found;
        else return findInRemoteStorage(nest, name);
    })
}

        // Ch.9

// Regexp can be made using either one of 2 notations:

let re1 = new RegExp("abc");
let re2 = /abc/;

// In the second case, forward slashes have a special use so we have to escape
// them with a forward slash if we want to use them. Also, backslahses that aren't
// part of a specific code will be perserved unless they are part of a special
// code, e.g. \n. Certain characters have a special meaning in regex, e.g.?, so it
// must be escaped to be used literally.

// Regex have a number of methods, one is test, where given a string, it will
// return a boolean depending if the string matches.

console.log(/abc/.test("abcde"));
// true

        // Matching a set of characters

// Putting a regex between a pair of square brackets menas to match any of the
// characters in it. There are certain special shortcuts that character groups have
// e.g. \d means the same as [0-0]. These can also be used in []. We also have:
// \w (any word character), \s (any whitespace, e.g. new line, space, tab), and
// the captail letter versions are the negation, e.g. \W (a nonword Char).

console.log(/[0-9]/.test("19892"));
// true

// We can also use negation in RegExp
let notBinary = /[^01]/;
console.log(notBinary.test("0101010"));
//-> false

    // Repeating parts of a pattern

// Putting a plus sign after something in a regexp means that it can be matched
// one or more times.
console.log(/\d+/.test("123"));

// Putting a * after something in regexp means that it can be matched 0 or more
// times ({0,1}). Putting a ? means matching is optional (O or 1 times, {0,1}).

// To indicate that a pattern should match a specific number of times, the
// number must be placed in curly braces e.g. {4}.
let dateTime = /\d{1,2}-\d{1,2}-\d{4}-\d{1,2}:\d{2}/;
console.log(dateTime.test("30-1-2003 8:45"));
// -> true

        // Grouping Subexpressions

// To use an operator like * or ? on more than one character at a time you can use
// parantheses
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// -> true
// Note: the i at the end makes the entire expression case insensitive

        // Matches and groups

// The best way to match is with test, which returns a boolean, otherwise you
// can use exec, which will return null or an object with info on the match.
// The object will return the index property that tells us where in the string
// the match begins. Strings also have a match method that behaves similarily.
let match = "one two 100".match(/\d+/);
console.log(match);
// -> ["100"]
console.log(match.index);
// > 8

// exec(regex) and match(strings) are similar functions
console.log((/\d+/).exec("one two 100"));
// -> ["100"]

// When the regex has subexpressions the whole match is the frist element in
// the match, then the matches from the subexpressions. However, only the first
// aprt matched by the group ends up being shown.
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// -> ["'hello'", "hello"]

        // The Date Type

// JavaScript has a standard object type for representing dates. You simply
// create a new Date object and you get the current date and time.
console.log(new Date());
// -> current date

// You can also create a date for a specific date, months start at 0 but days start at 1
console.log(new Date(2018, 4, 2));

// Time  stamps are stored as the number of milliseconds since the start of 1970;
console.log(new Date(2018, 11, 19).getTime());
// 1231231233

// We can use subexpressions to parse a string date and return a date object
function getString(string) {
    [_, day, month, year] = /(\d{1,2})-(\d{1,2})-(\d{4}))/.exec(string);
    return new Date(year, month-1, day);
}

// A problem with getString is that it can start anywhere in the string, giving
// us garbage values. So we can either use "^" to denote the strat of a string
// and we can use $ to denote the end of a string eg. /^\d+$/ is any string with
// one or more digits. We can also use word boundaries (\b) to denote beginiings
// and endings of strings.

console.log(/cat/.test("concatenate"));
// -> true
console.log(/\bcat\b/.test("concatenate"));
//-> false

        // Choice Patterns

// If we wanted to know whether a strings contains a number and is followed by
// one of three words then we can write 3 regexes or we can use the OR (|) operator

let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
// -> true
console.log(animalCount.test("15 pigchickens"));
// -> false

        // Backtracking

 // /\b([01]+b|\d+|[\da-f]+h\b/ This expression will match with a binary string
 // followed by a b or it will match a digit or it will match with a digit or a
 // char from a to f, followed by an h. Given a string of 103, it will first
 // attempt to match the first branch, when it gets to 3, it will realize that
 // it cannot continue so it will backtract to the beginning, it does this
 // because it rememebers its plce before each branch.

        // Replace Method

// Strings have a replace method where given a string, replaces a value for another
// value
console.log("papa".replace("a", "b"));
//-> pbpb

// We can also use regex, also we can add a "g" to the end of a regex to denote
// global, which will replace all matches and not just the first.
console.log("norobudur".replace(/[ou]/g, "a"));

console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip".replace(/(\w+), (\w+)/g, "$2 $1"));
// The $1 and $2 in the example above denote the groups in the pattern in the
// pattern that was matched. The whole group that was matched can be denoted by $&.

// You can also pass a function instead of a string for the second argument in
// replace. The function will be called with the amtched groups and the whole
// match, and will be returned in a new string.
let s = "the cia and the fbi";
console.log(s.replace(/\b(fbi|cia)\b/), str => str.toUpper());


        // Greed

// A lof of regex operators are greedy in that they try to match as much as they
// can before backtracking. By placing a ? after them they become non-greedy.

// Greedy version of commentStripper, note: in the second half of the regex, we
// use [^]* instead of .*, because block comments may span more than one line
// and the "." chracter represents anything except new lines.
function stripComments(code) {
    return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
console.log(stripCommnets("1 /* a  */+/* b */ 1"));
// -> 1 + 1

        // Dynamically Creating RegExp objects

// There are cases when you do not know the exact pattern you want to match.
// against. E.g. if you want to look for a user's name in a piexe of code and
// enclose it in underscores.
let name = "harry";
let text = "Harry is a suspicious character";
// In this regexp, since we are creating a stirng, the \b needs to be escaped by
// a \. Also, the gi represents the options, in this case global and case insensitive.
let regexp = new regexp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// -> _Harry_

// In case where the name is something weird like "dea+hl[]rd", we can escape
// anything that's not an alphanumeric character or a white space.
let name = "dea+hl[]rd";
let text = "This dea+hl[]rd guy is super annoying";
let escaped = name.replace(/[\\[.+*?(){|^&]/g, "\\$&"); // $& means th whole matched string
let regexp = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text.replace(regexp, "_$&_"));
// -> This _dea+hl[]rd_ guy is super annoying

        // The search method

// The indexOf method on strings cannot be called with a regular expression.
// But there is another method, search, that does expect a regular expression.
// Like indexOf, it returns the first index on which the expreession was found,
// or -1 when it wasn't found. Note: there is no way to indicate that the match
// should start at a given offset.

console.log("  word".search(/\s/));
// -> 2
console.log("  ".search(/\S/));
// -> 0-1

        // The lastIndex Property

// Regular expression objects have properties, one such property is source, which
// contains the string that expression was created from. Another is lastIndex,
// which controls, in a limited way, where the next match will start. To use
// lastIndex, the regex must have the global (g) and sticky(y) options enabled,
// and the match must happen through the exec method.

let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");
console.log(match.index);
// -> 4
console.log(pattern.lastIndex);
// -> 5

// If a match is successful, the lastIndex property gets updated to increase by
// one, if it is unsuccessful, then the property gets reset to 0, which is its
// default value. If it is called with sticky then that match will only succeed
// if it starts directly at lstIndex, whereas for global, it will search ahead
// for a positions where a match can start.

let global = /abc/g;
console.log(global.exec("xyz abc"));
// -> ["abc"]
let sticky = /abc/y;
console.log(stick.exec("xyz abc"));
// -> null

// One common problem which can occur with reusing regexp is that they will
// change the lastIndex property which will cause errors when using exec again.

// An effect with global is that it changes the way the match method works. When
// called with global instead of returning an array similar to that of exec, it
// returns an array of all strings of matches in the string. Global regular
// expressions should be used where they are necessary - calls to replace and
// places where you explicitly want to use lastIndex.

        // Looping over matches

// A common pattern is to loop over all occurances of a pattern in a string in
// a way that gives us access to the match object in the loop body, by using
// lastIndex and exec.

let input = "A string with 3 numbers in it.. 42 and 88.";
let number = /\b(\d+)\b/g;
let match;
while (match = number.exec(input)) {
    console.log("found", match[1], "at", match.index);
}

        // Patsing an INI file





// 200-230 ch.9 230-330 fcc 3-5 ch9ex
