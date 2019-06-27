/*
On Unix systems, there is a command line tool called grep that can be used to
quickly search files for a regular expression.

Write a Node script that can be run from the command line and acts somewhat like
grep. It treats its first command line argument as a regular expression and
treats any further arguments as files to search. It should output the names of
any file whose content matches the regular expression.

When that works, extend it so that when one of the arguments is a directory, it
searches through all files in that directory and its subdirectories.

Use asynchronous or synchronous file system functions as you see fit. Setting
things up so that multiple asynchronous actions are requested at the same time
might speed things up a little, but not a huge amount, since most file systems
can read only one thing at a time.
*/

//async function findFile(regex, ...files) {
let {readFile} = require("fs");
let {createReadStream} = require("fs");


    // files start at index 2 and onwards
    let regex = new RegExp(process.argv[2]);
    // let file  = process.argv[3];

for (let i = 3; i < process.argv.length; i++) {
        // check if a
    readFile(process.argv[i], "utf8", (error, text) => {
        if (error) throw error;
        else if (regex.test(text)) {
            console.log("Found RegExp:", regex, "in file(s):", process.argv[i]);
        } else if (i == (process.argv.length-1)) console.log("Not found");
    });
}




    // use stat to use readdir to find file name,
//
