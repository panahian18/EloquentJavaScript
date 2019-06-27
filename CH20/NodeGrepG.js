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
let {stat, readdir} = require("fs");

// Get the regular expression from the third process argument
let regex = new RegExp(process.argv[2]);

// Check if the location to be searched is a file or directory using stat
//let stats = stat(process.argv[3]);




// Iterate through the remaining arguments, which are the files to search
let pathI = process.cwd();

function foo(arr, path) {
    for (let j = 0; j < arr.length; j++) {
        let currentPath = path + "/" + arr[j];
        stat(currentPath, (err, stats) => {
            if (stats.isDirectory()) {
                    readdir(currentPath, (err, files) => {
                                if (err) throw err;
                                foo(files, currentPath);
                    });
            } else {
                readFile(currentPath, "utf8", (error, text) => {
                    if (error) throw error;
                    if (regex.test(text)) {
                        console.log("Found RegExp:", regex, "in file(s):", arr[j]);
                    } else if (j == arr.length) console.log("Not found");
                });
            }
        });
    }
}
let args = process.argv.slice(3);
foo(args, pathI);
