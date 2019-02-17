        // Node.js

// Node.js is a program that allows us to run javascript outside of the browser.
// It can be used to write anything from command line tools to HTTP servers.

// One of the most difficult aspects of writing programs that communicate over
// a network is managing input and output, that is data going to and from the
// network and hard drive. Especially in a way that schedules it efficiently.
// In such a program, asynchronous programming is often helpful, as it allows
// the program to send and receive data from multiple devices at the same time
// without complicated thread management and synchronization.

// Node was initially conceived for the purpose of making asynchronous
// programming easy and convenient. Asynchronous programs allow the program to
// send and receive data from and to multiple devices at the same time without
// complicated thread management and synchronization. JS does not have a built
// in approach to do in- and output, which allows it to easily adopt node's way
// of I/O.

    // The node command

// Installing Node.js gives you a command called node, which you can use to run
// JavaScript files. E.g. if you have a simple "Hello, World" program in a file
// called hello.js, then you can run it like so:

$ node hello.js
// -> "Hello, World"

// The console.log() method is similar to the one in the browser, but instead of
// going to the browser's console, the text goes to the process's standard
// output steam. You can also run node without a file, which will then allow you
// to write code, which it will immediately execute.

// The process binding, just like the console binding is available globally in
// Node, which provides various ways to inspect and manipulate the current
// program. The exit method ends the process and can be given an exit status
// code that informs the program that started the code whether it ended
// successfully (code 0) or not (any other code).

// To find the command line arguments given to your script, you can read
// process.argv, which is an array of strings, the first argument is "node", and
// the second is the name of your program, so the arguments really start at 2.

    // Modules

// Node doesn't have many bindings beyond console and process in the global scope,
// in order to access built-in funtionality, you have to ask the module system
// for it. Node uses the CommonJS module system (based on the require function)
// to load built-in modules and downloaded ones.

// When the string is passed to require, it has to resolve it to an actual file
// that it can load, so you can pass things like: /, ./, or ../, which are relative
// to the current module's path. If the path refers to a directory, node will
// try to load the file named index.js in that directory. If what's passed to
// require does not resemble a relative or absolute path then it is assumed to
// refer to a built-in or installed module in a node_modules directory.

// Here we set up a small project consisting of two files, the first one, called
// main.js, defines a script that can be called from the command line to reverse
// a string.

const {reverse} = require("./reverse");

// Index 2 holds the first actual command line argument
let argument = process.argv[2];

console.log(reverse(argument));

// The file reverse.js defines a library for reversing strings, which can be
// used both by this command line tool and other scripts that need direct
// access to a string-reversing function.
exports.reverse = function(string) {
    return Array.from(string).reverse().join("");
};

$ node main.js javascript
// -> tpircSavaJ

    // Installing with NPM

// Npm has an online repository of JavaScript modules. When you install Node,
// you also get the npm command, which you use to interact with this repository.
// Npm's main use is to download packages. We can use Npm to install ini:

$ npm install ini
// Running npm install will create a directory called node_modules, inside of
// which is the ini directory that contains the library. When we call require('ini'),
// this library is loaded and we can call its parse property.

$ node
> const {parse} = require("ini");
> parse("x = 1\ny = 2");
{x: '1', y: '2'}

// Npm by default installs packages under the current directory. In the above
// example, npm gave a warning because the package.json file didn't exist.
// It is recommended to create such a file for each project, either manually or
// by running npm init. It contains informaiton about the project such as the
// name and version, and lists its dependencies.

// Here is an example of such a file, this is for the robot project from ch.7
{
    "author": "Marijn Haverbeke",
    "name": "eloquent-javascript-robot",
    "description": "Simulation of a package-delivery robot",
    "version": "1.0.0",
    "main": "run.js",
    "dependencies": {
        "dijkstrajs": "^1.0.1",
        "random-item": "^1.0.0"
    },
    "license": "ISC"
}

// When you run npm install without naming a package to install, NPM will install
// the dependencies listed in package.json. When you install a specific package
// that is not already listed as a dependency, NPM will add it to package.json.

// A package.json file lists both the program's own version and versions for
// its dependencies. Packages evolve and eventually, code written for one package
// may not work with a modified version of the packge. NPM has a schema that
// packages must follow, called semantic versioning. A semantic version consists
// of 3 numbers separated by commas, e.g. 2.3.0.

// Everytime a new functionality is added, the middle number needs to be incremented
// and everytime compatibility is broken, so that existing code that uses the
// package might not work with the new version, the first number is incremented.
// The third number represents backwards-compatible bug fixes. A caret character
// (^) in front of the dependency number in package.json means that any code
// that is compatible with the given number may be installed. E.g. ^2.3.0 means
// that any version greater than 2.3.0 but less than 3.0.0 is allowed.


    // The file system module

// The file system (fs) is the most commonly used built-in module in Node. It
// provides functions for working with files and directories. E.g. readFile
// reads a file and then calls a callback with the file's contents.

let {readFile} = require("fs");
readFile("file.txt", "utf8", (error, text) => {
    if (error) throw error;
    console.log("The file contains:", text);
});

// The second argument to readFile indicates the character encoding, the standard
// is UTF-8, if no information is provided then the function will return a
// buffer object.

const {readFile} = require("fs");
readFile("file.txt", (error, buffer) => {
    if (error) throw error;
    console.log("The file contained", buffer.length, "bytes.",
                "The first byte is:", buffer[0]);
});

// A similar function, writeFile, is used to write a file to a disk.
const {writeFile} = require("fs");
writeFile("graffiti.txt", "Node was here", err => {
    if (err) console.log(`Failed to write to file: ${err}`);
    else console.log("File written.");
});

// Writefile does need to have a char encoding passed to it, because it assumes
// to write out text with UTF-8.

// The fs module contains many other useful funcitons: readdir will return the
// files in a directory as an array of strings, stat will retrieve information
// about a file, rename will rename a file, unlink will remove one, and so on.
// The documentation https://nodejs.org has more details.

// Most of the functions of fs take callbacks as the last parameter, which they
// call either with an error or successful result. However, callbacks have their
// downsides, one being that error handling becomes verbose and error prone.
// Nodejs is still integrating all features of ES6, including promises. There is
// an object called promises exported from the fs package that has the same
// functions as fs but uses promises instead of callbacks.

const {readFile} = require("fs").promises;
readFile("file.txt", "utf-8")
    .then(text => console.log("The file contains:", text));

// Many of the functions in fs have a synchronous variant, which has the same
// name but with Sync added to the end. Doing this however, will cause the
// entire program to stop while the syncrhonous aciton is being performed
// E.g. readFileSync:

const {readFileSync} = require("fs");
console.log("The file contains:",
                readFileSync("file.txt", "utf8"));

    // The HTTP module

// Another very important module is called http. It provides functionality for
// running servers and making HTTP requests. This is all it takes to start an
// HTTP server:

const {createServer} = require("http");
let server = createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(`
        <h1>Hello!</h1>
        <p>You asked for <code>${request.url}</code></p>`);
    response.end();
});
server.listen(8000);
console.log("Listening to (port 8000)");

// Running this script using node will allow the browser to access a website
// at http://localhost:8000/hello, this will make the browser make a request to
// our server.

// The function passed to creatServer is the function that will be called
// everytime a client connects to the server. The request and response bindings
// are objects that represent the incoming and outgoing data. The fist contains
// information about the request, such as its url property, which tells us to
// what URL the request was made. When that page is opened in the browser, it
// sends a request to your own computer, this causes the server to run and send
// back a response, which you can see in the browser.

// Sending information back is done on the response object, the first method is
// writeHead, which will write out the response headers. You give it the status
// code (in this case 200 for "OK"), and an object that contains the header
// values. This example sets the Content-Type header to inform the client that
// we'll be sending back an HTML document.

// The actual response body is sent using response.write. This method can be
// called multiple times, to send data piecemeal, e.g. streaming data as it
// becomes available. Finally, response.end signals the end of the response.

// server.listen(8000) causes the server to start listening for connections on
// port 8000, which is why you have to connect to localhost:8000 to speak to
// the server and not just localhost, which would use the default port 80.
// Running this script will cause the process to sit and wait, listening for
// events, in this case network connections, to exit, you must use ctrl-c.
// Note a real webserver will check to see what type of request is being made
// and looks at the URL to find out which resource this action is being
// performed on.

// To act as an HTTP client, we can use the request function in the http module.
const {request} = require("http");
let requestStream = request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, response => {
    console.log("Server responded with status code",
        reponse.statusCode);
});
requestStream.end();

// The first argument to request configures the request, telling Node what server
// to talk to, what path to request from that server, which method to use, etc.
// The second argument is the fucntion that should be called when a response
// comes in. It is given an object that allows us to inspect the response, for
// example to find out its status code.

// The object returned by request allows us to stream data into the request with
// the write method and finish the request with the end method. The example does
// not use write because GET requests should not contain data in their request
// body. There is a similar request function in the https module that can be
// used to make requests to https: URLs.

// Making requests with Node's raw functionality is rather verbose, so there are
// much more convenient wrapper packages available on NPM. E.g. node-fetch
// provides the promise-based fetch interface.

    // Streams

// So far we have seen two intances of writable streams in the http examples,
// above, the request and response objects. These writable streams are a widely
// used concept in Node, these objects have a write method, which can be passed
// a Buffer or a string. The end method closes the stream, it can optionally
// take a value to write to the stream before closing. Both of these methods
// can take a callback function to call when they are done.

// It is also possible to use createWriteStream from the fs module to create a
// writable stream that points at a file. Then you can use the write method
// on the resulting object to write the file one piece at a time, rather than in
// one shot as with writeFile.

// Both response and request are readable streams, a server reads requests then
// writes responses, while the client first writes a request and then reads the
// response. Reading from a stream is done using event handlers, rather than
// methods.

// Objects that emit events in Node have a method called on that is similar to
// the addEventListener method in the browser. You give it an event name and then
// a function, and it will register that function to be called whenever the given
// event occurs.

// Readable streams have "data" and "end" events. The first is fired every time
// data comes in, and the second is called whenever the stream is at its end.
// This model is well suited for streaming data that can be immediately processed,
// even when the whole document isn't available yet. A file can be read as a
// readable stream by using createReadStream from fs.

// This code creates a server that reads request bodies and streams them back
// to the client as all-uppercase text:

const {createServer} = require("http");
createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    request.one("data", chunk => {
        response.write(chunk.toString().toUpperCase()));
    request.on("end", () => response.end());
}).listen(8000);

// The chunk value needed to be converted to a string because the data is a
// binary Buffer.

// The following, when run with the uppercasing server active, will send a
// request to that server and write out the response it gets.

const {request} = require("http");
request({
    hostname: "localhost",
    port: 8000,
    method: "POST"
}, response => {
    response.on("data", chunk =>
        process.stdout.write(chunk.toString()));
    }).end("Hello Server");

// The example above writes to process.stdout (the process's standard output),
// instead of using console.log, because console.log adds an extra newline
// after each piece of text that it writes, which isn't apporpriate here since
// the response may come in as multiple chunks.

    // A file server

// Here we will create an example that will bridge the gap between an HTTP
// server and the file system, to create an HTTP server that allows remote
// access to a file system. Such a server can allow web apps to store and share
// info, give multiple people shared access to files, etc.

// When we treat files as HTTP resouces, the HTTP methods GET, PUT, and DELETE
// can be used to read, write, and delete the files, respectively. We will
// interpret the path in the request as the path of the file that the request
// refers to. Because we don't want to share our whole file system, we'll
// interpret these paths as starting from the server's working directory, e.g.
// this could be /tmp/public, so a request for /file.txt should refer to
// /tmp/public/file.txt.

// We will build our program one piece at a time, using an object called methods
// to store the functions that will handle the various HTTP methods. Method
// handlers are async functions that get the request object as an argument and
// returns a promise that resolves to an object that describes the response.

const {createServer} = require("http");
const methods = Object.create(null);

createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;
    handler(request)
        .catch(error => {
            if (error.status != null) return error;
            return {body: String(error), status: 500};
        })
        .then(({body, status = 200, type = "text/plain"}) => {
            response.writeHead(status, {"Content-Type": type});
            if (body && body.pipe) body.pipe(response);
            else response.end(body);
        });
}).listen(8000);

async function notAllowed(request) {
    return {
        status: 405,
        body: `Method ${request.method} not allowed.`
    };
}

// This sets up a server that will check for a http method and execute it, so
// far, however, we have not added any so it will just call notAllowed. If the
// request handler's promise is rejected, the catch call translates the error
// into a response object.

// The status and type fields of the response description may be omitted, in
// which case, a default of 200 and "text/plain" is assumed, respectively. When
// the value of body is a readable stream, then it will have a pipe method that
// is used to forward all content from a readable stream into a writable stream.
// If not then the value of body is assumed to be null, a string, or a buffer
// and it is passed directly to the response's end method.

// To figure out which file path corresponds to a request URL, the urlPath
// function uses Node's built-in url module to parse the URL. It takes its path
// name, which will be something like "/file.txt", decodes it to get rid of the
// %20-style escape codes, and resolves it relative to the program's working dir.

// One of the precautions we must take is to make sure that clients are not
// trying to access parts of the file system we don't want them to. For example,
// paths that include ../ refer to a parent directory. To avoid this problem,
// urlPath uses the resolve function from the path module, which resolves
// relative paths. The sep binding from the path package is the system's separator
// in this case, it's /.

// When the path doesn't start with the base directory, the function throws an
// error response object, using the http status code indicating that access to
// the resource is forbidden.

const {parse} = require("url");
const {resolve, sep} = require("path");

const baseDirectory = process.cwd();

function urlPath(url) {
    let {pathname} = parse(url);  // Gets rid of %20 style escape codes
    let path = resolve(decodeURIComponent(pathname).slice(1)); // Returns an asolute path, and removes the / at the end
    if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {  // Checks to see if it is the current dir and if it starts with /
        throw {status: 403, body: "Forbidden"};
    }
    return path;
}

// Here we set up the GET method to return a list of files when reading a
// directory or a file's content. Since our file can be anything, our server
// has to figure out the content type. Here we use the npm package MIME, which
// tells us the mime type (e.g. text/plain) for a lot of different file ext.

$ npm install mime@2.2.0 // this command installs mime

// When a requested file does not exists, the correct HTTP status code to return
// is 404. We'll use the stat function, which looks up information about a file,
// to find out both whether the file exists and whether it is a directory. Because
// it is has to touch the disk and thus might take a while, it is asyncrhonous.
// This means it has to be imported from promises instead of directly from fs.

const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const mime = require("mime");

methods.GET = async function(request)
    let path = urlPath(request.url);
    let stats;
    try {
        async stats(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 404, body: "File not found"};
    }
    if (stats.isDirectory()) {
        return {body: (await readdir(path)).join("\n")};
    } else {
        return {body: createReadStream(path),
                type: mime.getType(path)};
    }
};

// If the file does not exist, it will throw the "ENOENT" error code (from unix).
// Otherwise, we can tell if the file is a directory by using isDirectory() from
// stats, which is the object returned by stat, which can tell us a number of
// things about the file, including size (size property), and its modification
// date (mtime property).

// We use readdir to read the array of files in a directory and return it to the
// client. For normal files, we create a readble stream with createReadStream
// and return that as the body, along with the content type that the mime
// package gives us for the file's name.

// The code to handle DELETE requests is the following:

const {rmdir, unlink} = require("fs").promises;

methods.DELETE = async function(request) {
    let path = urlPath(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 204};
    }
    if (stats.isDirectory()) await rmdir(path);
    else await unlink(path);
    return {status: 204};
}

// When an HTTP response does not contain any data, the status code 204 ("no
// content") can be used to indicate this. Since the response to deletion doesn't
// need to transmit any information beyond whether the operation succeeded, that
// is a sensible thing to return here.

// It's important to note that deleting a nonexistent file returns a success
// status code, rather than an error. This is because you could say that if the
// object to be deleted is not there then the request's objective is already
// fulfilled. The HTTP standard encourages us to make requests indempotent, which
// means making the same request multiple times produces the same result as making
// it once.  

//The code to handle PUT requests:

const {createWriteStream} = require("fs");

function pipeStream(from, to) {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        to.on("error", reject);
        to.on("finish", resolve);
        from.pipe(to);
    });
}

methods.PUT = async function(request) {
    let path = urlPath(request.url);
    await pipeStream(request, createWriteStream(path));
    return {status: 204};
};

// Here we don't check if a file exists, if it does we just overwrite it. We use
// pipe to stream data from a readable stream to a writable stream, in this case
// from the request to the file. We also wrap pipe to return a promise since it
// doesn't do so by default. When something goes wrong with opening the file,
// createWriteStream will still return a stream, but that stream will fire an
// "error" event. The output stream to the request may also fail, e.g. in a
// network failure, so we wire up both streams' error events to reject the promise.
// When pipe is done, it will close the output stream, which will fire a "finish"
// event. That's the point where we can successfully resolve the promise.

// We can use the Unix command curl to make HTTP requests. Below, we use the -X
// option to set the request's method, and -d is used to include a request body.

$ curl http://localhost:8000/file.txt
File not found
$ curl -X PUT -d hello http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
hello
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
File not found

// The first request for file.txt fails since the file does not exist yet. The
// PUT request creates the file, and the next request successfully gets it. After
// deleting the file with a DELETE request, the file is missing again.
