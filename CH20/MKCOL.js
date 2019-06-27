/*
Though the DELETE method in our file server is able to delete directories (using
rmdir), the server currently does not provide any way to create a directory.
Add support for the MKCOL method (“make collection”), which should create a
directory by calling mkdir from the fs module. MKCOL is not a widely used HTTP
method, but it does exist for this same purpose in the WebDAV standard, which
specifies a set of conventions on top of HTTP that make it suitable for creating
documents.
*/

const {createServer} = require("http");

const methods = Object.create(null);

// Create Server
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

const {parse} = require("url");
const {sep, resolve} = require("path");

const baseDirectory = process.cwd();

// urlPath

function urlPath(url) {
    let {pathname} = parse(url);  // Gets rid of %20 style escape codes and returns everything past .com
    let path = resolve(decodeURIComponent(pathname).slice(1)); // Returns an asolute path, removes anything like /../, removes the / at the end, slice(1) removes the / at the beginning
    if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {  // Checks to see if it is the current dir and if it starts with /
        throw {status: 403, body: "Forbidden"};
    }
    return path;
}

// MKCOL method for our server

const {mkdir} = require("fs").promises;

methods.MKCOL = async function(request) {
    let path = urlPath(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 404, body: "Location not found"};
    }
    if (stats.isDirectory()) {
        return await mkdir(path);
    }
}
