        // Chapter 21 - Project: Skill-Sharing Website

// In this final project chapter, our goal is to set up a website for managing talks 
// given at a skill-sharing meeting. Imagine a small group of people meeting up 
// regularly in the office of one of the members to talk about unicycling. The 
// previous organizer of the meetings moved to another town, and nobody stepped
// forward to take over this task. We want a system that will let the participants
// propose and discuss talks among themselves, without a central organizer.

        // Design

// There is a server part to this project, written for Node.js, and a client part, 
// written for the browser. The server keeps the list of talks proposed for the 
// next meeting, and the client shows this list. Each talk has a presenter name, a 
// title, and an array of comments associated with it. The client allows users to
// propose new talks (adding them to the list), delete talks, and comment on existing
// talks. Whenever the user makes such a change, the client makes an HTTP request.

// This project requires that whenever someone submits a new talk or adds a comment
// all people who have the page open in their browser should immediately see the 
// change. A solution to this problem is called long polling.

        // Long Polling

// In order to notify a client that something has changed, we need a connection to
// that client. However, browsers do not accept connections, and routers would block 
// such connections anyway. Instead of having a server making a connection with the 
// client, we have the client keep a connection open and keep it around so that the
// server can send information when it needs to.

// Normally, a client makes a simple HTTP request and the server comes back with a 
// single response. Although we could WebSockets, we will keep it simple and instead 
// use long polling, wheere clients continuously ask the server for new information 
// using regular HTTP requests, and the server stalls its answer when it has nothing
// new to report. E.g. when a user has the site open in their browser, the browser 
// will make a request for updates and will be waiting for a response to that request.
// When another user posts a new talk, the server will notice that the first user
// is waiting for an update and will send a response containing the new talk. 

// To prevent connections from timing out (aborted due to a lack of activity), long 
// polling techniques usually set a maximum time for each request, after which the 
// server will respond anyway, even it has nothing to report, after which the client 
// will make a new request. Periodically restarting the requerst also makes the 
// technique more robust, allowing clients to recover from temporary connection
// failures or server problems.

        // HTTP Interface

// We will initially consider the interface at which the client and server communicate,
// the HTTP interface. This interace will use JSON as the format of the request and 
// response. The interface will center around the /talks path, paths that do not 
// start with /talks will be used for serving static files, the HTML and JS code for 
// the client-side system.

// A GET request to /talks returns a JSON document like this:
[{"title": "Unituning",
"presenter": "Jamal",
"summary": "Modifying your cycle for extra style",
"comments": []}]

// We create a new talk by making a PUT request to a URL like /talks/Unituning, 
// where the part after the second slash is the title of the talk. The PUT request 
// body then should contain a JSON object that has presenter and summary properties. 
// The talk titles need to be encoded with the encodeURIComponent funciton when 
// building a URL since some characters, like spaces, may not appear normally.

// A sample request to create a talk
/*
PUT /talks/How%20to%20Idle HTTP/1.1
Content-Type: application/json
Content-Length: 92

{"presenter": "Maureen",
  "summary": "Standing still on a unicycle"}
*/

// Such URLs also support GET requests to retrieve the JSON representation of a 
// talk and DELETE requests to delete a talk.

// Adding a comment to a talk is done with a POST request to a URL like
// /talks/Unituning/comments, with a JSON body that has author and message properties

/*
POST /talks/Unituning/comments HTTP/1.1
Content-Type: application/json
Content-Length: 72

{"author": "Iman",
 "message": "Will you talk about..."}
*/

// In order to support long polling, we need 2 extra headers to notify the server 
// to delay responses if no new information is available, Etag and If-None-Match.
// Servers use the ETag ("entity tag") header in a response, which has a value as 
// a string that identifies the current version of the resource. When clients later 
// make a request, they may make a conditional request by including an If-None-Match
// header whose value holds that same string. If the resource hasn't changed the 
// server will respond with status code 304, which means "not modified", the telling
// the client that the cached version is still current. When the tag does not match, 
// the server responds as normal.

// This mechanism allows the client to tell the server what version of the list of
// talks it has, and the server responds only when that list has changed. However,
// instead of returning a 304 response, the server instead stalls the response and 
// only returns when something new is available or a given amount of time has elapsed.
// We provide another header, Prefer: wait=90, which tells the server that the client 
// is willing to wait up to 90 seconds for the response. The server will keep a 
// version number that it updates every time the talks change and use that as the 
// ETag value. Clients can make requests like this to be notified when the talks 
// change:

/*
GET /talks HTTP/1.1
If-None-Match: "4"
Prefer: wait=90

(time passes)

HTTP/1.1 200 OK
Content-Type: application/json
ETag: "5"
Content-Length: 295

[...]
*/


// Note: the application here does not do any access control, everyone can comment,
// modify, or delete talks. 

        // The Server

// In this section we will build the server-side part of the program, this code
// section runs on Node.js

                // Routing

// Our server will use "createServer" to start an HTTP server. Before we can handle
// any new requests, we must be able to distinguish between the various kinds of 
// requests (as determined by the method and the path) that we support. Instead of 
// writing a long chain of if statements, we will use a router, which is a component
// that helps dispatch a request to the function that can handle it. E.g. you can 
// tell a router that PUT requests with a path that matches the regular expression
// /^\/talks/\([^\/]+)$/ (/talks/ followed by a talk title) can be handled by a given 
// function. In addition, it can help extract the meaningful parts of the path (in
// this case the talk title), wrapped in parentheses in the regular expression, and 
// pass them to the handler function. 

// Here we write a router called router.js, which we will later require from our server

const {parse} = require("url");

module.exports = class Router {
        constructor() {
                this.routes = [];  // add an array of routes to our state
        }
        add(method, url, handler) {  // method to add handlers for given method & url
                this.routes.push({method, url, handler}); // add method, url, and handler to routes
        }
        resolve(context, request) {  // resolve requests with given request and context (which will be the server instance)
                let path = parse(request.url).pathname; // get the url from the request

                for (let {method, url, handler} of this.routes) { // iterate through all of the routes
                        let match = url.exec(path); // if the url matches, and..
                        if (!match || request.method != method) continue; // the method matches
                        let urlsParts = match.slice(1).map(decodeURIComponent); // encode all of the strings
                        return handler(context, ...urlParts, request); // return a response by calling the handler
                }
                return null;
        }
};

        // Serving Files

// When the request matches none of the request types defined in our router, the 
// server must interpret it as a request for a file in the public directory.
// Here we use the static file server "ecstatic", whose package exports a function 
// that can be called with a configuration object to produce a request handler function.
// We use the "root" option to tell the server where it should look for files. The 
// handler function accepts request and response parameters and can be passed directly
// to createServer to create a server that serves only files. We want to first check 
// for requests that we should handle specially, though, so we wrap it in another 
// function. 


const {createServer} = require("http");
const Router = require("./router");
const ecstatic = require("ecstatic");

const router = new Router();
const defaultHeaders = {"Content-Type": "text/plain"};

class skillShareServer {
        constructor(talks) {
                this.talks = talks;
                this.version = 0;
                this.waiting = [];

                let fileServer = ecstatic({root: "./public"}); // Here we use ecstatic to create a file server with the root option set to public to tell the server where to look for files
                this.server = createServer((request, response) => {  
                  let resolved = router.resolve(this, request); // call the handler function 
                  if (resolved) {   
                        resolved.catch(error => {  
                                if (error.status != null) return error;
                                return {body: String(error), status: 500};
                        }).then(({body,  // otherwise, if the router returned with a valid value then send the response
                                status = 200,  
                                headers = defaultHeaders}) => {
                          response.writeHead(status, headers); 
                          response.end(body);  
                        });
                } else {
                  fileServer(request, response);
                }
        });
        }
        start(port) {
                this.server.listen(port);
        }
        stop() {
                this.server.close();
        }
}

        // Talks as Resources

// The talks that have been proposed are stored in the talks property of the server,
// an object whose property names are the talk titles. These will be exposed as HTTP
// resources under /talks/[title], so we need to add handlers to our router that 
// implement the various methods that clients can use to work with them. 


// The handler for GET requests for a single talk must look up the talk and respond 
// either with the talk's JSON data or with a 404 error response.

const talkPath = /^\/talks\/([^\/]+)$/;

router.add("GET", talkPath, async (server, title) => {
        if (title in server.talks) {
                return {body: JSON.stringify(server.talks[title]),
                        headers: {"Content-Type": "application/json"}};
        } else {
                return {status: 404, body: `No talk '${title}' found` };
        }
});

// Deleting a talk is done by removing it from the talks object.

router.add("DELETE", talksPath, async (server, title) => {
        if (title in server.talks) {
                delete server.talks[title];
                server.update(); // this method notifies long polling about requests
        }
        return {status: 204};
})



        // Long Polling Support

// 369 - 386

