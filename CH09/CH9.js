// RegExp can be made be using either two notations:

let re1 = new RegExp("abc");
let re2 = /abc/;

// In the second notation, forward slashes have a special use, so in order to
// use them we must escaped them with a backslash. Also, backslashes that aren't
// part of a specific code will be perserved unless they are part of a special
// code eg. \n. Certain characters have special meaning in regex, eg. ?, so they
// must be escaped to be used literally.

// Regex have a number of methods, one is test, where given a string, it will
// return a boolean depending if the string matches

console.log(/abc/.test("abcde"));
// true

    // Matching a set of characters

// Putting a regex between a pair of square brackets means to match any of the
// characters in it. There are certain special shortcuts that character groups
// have, eg. \d means the same as [0-9]. These can also be used in []. We also
// have: \w (any word character), \s (any whitespace, e.g. new line, space, tab),
// and the capital letter versions are the negation, e.g. \W (a nonword char).

console.log(/[0-9]/.test("in 1992"));
// -> true

// We can also use negation in RegExp
let notBinary = /[^01]/;
console.log(notBinary.test("0101010"));
// -> false

    // Repeating parts of a pattern

// Putting a plus sign after something in a regexp means it can be matched one
// or more times
console.log(/'\d+'/.test("'123'"));

// Putting a * after something in a regexp means it can be matched as 0 or more
// times ({0,}). Putting a ? means matching is optional (0 or 1 times, {0,1}).

// To indicate that a pattern should match a specific number of times, the
// number must be placed in curly braces eg. {4}
let dateTime = /\d{1,2}-\d{1,2}-\d{4}-\d{1,2}:\d{2}/;
console.log(dateTime.test("30-1-2003 8:45"));
// -> true

    // - Grouping Subexpressions

// To use an operator like * or ? on more than one character at a time you can
// use parantheses
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohooooohoohooo"));
// -> true
// Note: the i at the end makes the entire expression case insensitive

    // - Matches and groups

// The best way to match is with test, which returns a boolean, otherwise you
// can use exec, which will return null or an object with info on the match.
// The object will return the index property that tells us where in the string
// the match begins. Strings also have a match method that behaves similarily.
let match = "one two 100".match(/\d+/);
console.log(match);
// -> ["100"]
console.log(match.index);
// -> 8

// exec(regex) and match(strings) are similar functions
console.log((/\d+/).exec("one two 100"));
// -> ["100"]

// When the regex has subexpressions, the whole match is the first element in
// the match, then the matches from the subexpression. However, only the first
// part matched by the group ends up being shown
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// -> ["'hello'", "hello"]

    // - The Date Type

// Javascript has a standard object type for representing dates. You simply
// create a new Date object and you get the current date and time
console.log(new Date());

// You can also create a date for a specific date, months start at 0 but days start at 1
console.log(new Date(2018, 4, 2));

// Time stamps are stored as the number of milliseconds since the start of 1970.
console.log(new Date(2013, 11, 19).getTime());
// -> 12314124125

// We can use Subexpressions to parse a string date and return a date object
function getString(string) {
  [_, day, month, year] = /(\d{1,2})-(\d{1,2})-(\d{4}))/.exec(string);
  return new Date(year, month-1, day);
}

// A problem with getString is that it can start anywhere in the string, giving
// us garbage values. So we can either use "^" to denote the start of a string
// and we can use $ to denote the end of a string eg. /^\d+$/ is any string with
// one or more digits. We can also use word boundaries(\b) to denote beginnings
// and endings of Strings

console.log(/cat/.test("concatenate"));
// -> true
console.log(/\bcat\b/.test("concatenate"));
// -> false

    // - Choice Patterns

// If we wanted to know whether a string contains a number and is folllowed by
// one of three words then we can write 3 regexs or we can use the OR operator (|).

let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test(15 pigs));
// -> true
console.log(animalCount.test("15 pigchickens"));
// -> false

    // - Backtracking

// /\b([01]+b|\d+|[\da-f]+h)\b/ This expressions will match with a binary string
// folllowed by a "b", or a digit with no suffix, or a digit or the letters a-f,
// denoting a hex number followed by a h, this is all between word boundaries.
// If given the string 103, it attempts the first branch, but at the digit 3, it
// realizes that it is in the wrong branch and backtracks, it can do this because
// it remembers its place before each branch.

    // - Replace method

// Strings have a method called replace, that given a string, replaces a value
// for another value
console.log("papa".replace("a", "b"));
// -> pbpb

// We can also use regex, also we can add a "g" to the end of a regex to denote
// global, which will replace all matches not just the first
console.log("borobudur".replace(/[ou]/g, "a"));

console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip".replace(/(\w+), (\w+)/g, "$2 $1"));

// The $1 and $2 in the example above denote the groups in the pattern that was
// matched. The whole group that was matched can be denoted by $&.

// You can also pass a function instead of a string for the second argument in
// replace. The function will be called with the matched groups and the whole
// match, and will be returned in a new String.
let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/),str => str.toUpper());

    // - Greed

// A lot of regex operators are greedy in that they try to match as much as they
// can before Backtracking. By placing a ? after them they become non-greedy.

// Greedy version of commentStripper, note: in the second half of the regex, we
// use [^]* instead of .*, because block comments may span more than one line
// and the "." character represents anything except newlines.
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
// This will match the entire string before backtracking and finding an
// occurance of */

// Non-greedy version of commentStripper
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1

    // - Dynamically Creating RegExp objects

// There are cases when you do not know the exact pattern you want to match
// against. E.g. if you want to look for a user's name in a piece of code and
// enclose it in underscores.
let name = "harry";
let text = "Harry is a suspicious character";
// In this regexp, since we are creating a string, the \b needs to be escaped by
// a \. Also, the gi represents the options, in this case global and case-insensitive
let regexp = new regexp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// -> _Harry_

// In case where the name is something weird like "dea+hl[]rd", we can escape
// anything that's not an alphanumeric character or a white space.
let name = "dea+hl[]rd";
let text = "This dea+hl[]rd guy is super annoying.";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&"); // $& means the whole matched string
let regexp = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text.replace(regexp, "_$&_"));
// → This _dea+hl[]rd_ guy is super annoying.

    // The Search Method

// The indexOf method on strings cannot be called with a regular expression.
// But there is another method, search, that does expect a regular expression.
// Like indexOf, it returns the first index on which the expression was found,
// or -1 when it wasn't found. Note: there is no way to indicate that the match
// should start at a given offset.

console.log("  word".search(/\s/));
// -> 2
console.log("    ".search(/\S/));
// -> -1

    // - The lastIndex Property

// Regular expression objects have properties, one such property is source, which
// contains the string that expression was created from. Another is lastIndex,
// which controls, in a limited way, where the next match will start. To use
// lastIndex, the regex must have the global (g) and sticky (y) options enabled,
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
// default value. If it is called with sticky then the match will only succeed
// if it starts directly at lastIndex, whereas for global, it will search ahead
// for a position where a match can start.

let global = /abc/g;
console.log(global.exec("xyz abc"));
// -> ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// -> null

// One common problem which can occur with reusing regexp is that they will
// change the lastIndex property which will cause errors when using exec again.

// An effect with global is that it changes the way the match method works. When
// called with global instead of returning an array similar to that of exec, it
// returns an array of all strings of matches in the string. Global regular
// expressions should be used where they are necessary - calls to replace and
// places where you want to explicitly use lastIndex.

    // - Looping Over Matches

// A common pattern is to loop over all occurances of a pattern in a string in
// a way that gives us access to the match object in the loop body, by using
// lastIndex and exec.

let input = "A string with 3 numbers in it.. 42 and 88.";
let number = /\b(\d+)\b/g;
let match;
while (match = number.exec(input)); {
  console.log("found", match[0], "at", match.index);
}

    // - Parsing an INI File

// We will conclude this chapter by looking at an example that calls for RegExp

// We have the following configuration file, which we will read from
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

// We want to convert a string into an object whose properties hold strings for
// sectionless settings and sub-ojects for settings. With those sub-objects
// holding the section's settings.

// We first split the string into lines by the newline separator or /r then /n
function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach(line => {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}
