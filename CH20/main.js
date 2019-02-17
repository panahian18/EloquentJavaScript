const {reverse} = require("./reverse")
// Index 2 holds the first actual command line argument
let argument = process.argv[2];

console.log(reverse(argument));

// The file reverse.js defines a library for reverskking strings, which can be
// used both by this command line tool and other scripts that need di
