
const { parse } = require("url");

module.exports = class Router {
    constructor() {
        this.routes = [];  // add an array of routes to our state
    }
    add(method, url, handler) {  // method to add handlers for given method & url
        this.routes.push({ method, url, handler }); // add method, url, and handler to routes
    }
    resolve(context, request) {  // resolve requests with given request and context (which will be the server instance)
        let path = parse(request.url).pathname; // get the url from the request

        for (let { method, url, handler } of this.routes) { // iterate through all of the routes
            let match = url.exec(path); // if the url matches, and..
            if (!match || request.method != method) continue; // the method matches
            let urlParts = match.slice(1).map(decodeURIComponent); // encode all of the strings
            return handler(context, ...urlParts, request); // return a response by calling the handler
        }
        return null;
    }
};