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
// single response. Although we could use WebSockets, we will keep it simple and instead 
// use long polling, where clients continuously ask the server for new information 
// using regular HTTP requests, and the server stalls its answer when it has nothing
// new to report. E.g. when a user has the site open in their browser, the browser 
// will make a request for updates and will be waiting for a response to that request.
// When another user posts a new talk, the server will notice that the first user
// is waiting for an update and will send a response containing the new talk. 

// To prevent connections from timing out (aborted due to a lack of activity), long 
// polling techniques usually set a maximum time for each request, after which the 
// server will respond anyway, even it has nothing to report, after which the client 
// will make a new request. Periodically restarting the request also makes the 
// technique more robust, allowing clients to recover from temporary connection
// failures or server problems.

// HTTP Interface

// We will initially consider the interface at which the client and server communicate,
// the HTTP interface. This interace will use JSON as the format of the request and 
// response. The interface will center around the /talks path, paths that do not 
// start with /talks will be used for serving static files, the HTML and JS code for 
// the client-side system.

// A GET request to /talks returns a JSON document like this:

/*
[{
    "title": "Unituning",
    "presenter": "Jamal",
    "summary": "Modifying your cycle for extra style",
    "comments": []
}]
*/

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
// to delay responses if no new information is available, ETag and If-None-Match.
// Servers use the ETag ("entity tag") header in a response, which has a value as 
// a string that identifies the current version of the resource. When clients later 
// make a request, they may make a conditional request by including an If-None-Match
// header whose value holds that same string. If the resource hasn't changed the 
// server will respond with status code 304, which means "not modified", telling
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
            let urlParts = match.slice(1).map(decodeURIComponent); // decode all of the strings
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


const { createServer } = require("http");
const Router = require("./router");
const ecstatic = require("ecstatic");

const router = new Router();
const defaultHeaders = { "Content-Type": "text/plain" };

class skillShareServer {
    constructor(talks) {
        this.talks = talks;
        this.version = 0;
        this.waiting = [];

        let fileServer = ecstatic({ root: "./public" }); // Here we use ecstatic to create a file server with the root option set to public to tell the server where to look for files
        this.server = createServer((request, response) => {
            let resolved = router.resolve(this, request); // call the handler function 
            if (resolved) {
                resolved.catch(error => {
                    if (error.status != null) return error;
                    return { body: String(error), status: 500 };
                }).then(({ body,  // otherwise, if the router returned with a valid value then send the response
                    status = 200,
                    headers = defaultHeaders }) => {
                    response.writeHead(status, headers);
                    response.end(body);
                });
            } else {
                fileServer(request, response);
            }
        });
    }
    start(port) {
        console.log("Listening on port", port);
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
        return {
            body: JSON.stringify(server.talks[title]),
            headers: { "Content-Type": "application/json" }
        };
    } else {
        return { status: 404, body: `No talk '${title}' found` }
    }
});

// Deleting a talk is done by removing it from the talks object.

router.add("DELETE", talkPath, async (server, title) => {
    if (title in server.talks) {
        delete server.talks[title];
        server.updated();
    }
    return { status: 204 };
});

// To retrieve the content of a request body, we define a function called readStream,
// which reads all content from a readable stream and returns a promise that resolves
// to a string.

function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => resolve(data));
    });
}

// We use PUT requests to add new talks, the PUT handler uses the readStream to read
// request bodies to check if the data has presenter and summary properties, which are 
// strings. We need to perform this check before commmitting the data to our store since
// we may receive any type of nonsense data. 

router.add("PUT", talkPath, async (server, title, request) => {
    let requestBody = await readStream(request);
    let talk;
    try { talk = JSON.parse(requestBody); }
    catch (_) { return { status: 400, body: "Invalid JSON" }; }
    if (!talk || 
        typeof talk.presenter != "string" ||
        typeof talk.summary != "string") {
        return { status: 400, body: "Bad talk data" };
    }
    server.talks[title] = {
        title,
        presenter: talk.presenter,
        summary: talk.summary,
        comments: []
    };
    server.updated();
    return { status: 204 };
});

// Adding a comment to a talk works similarly. We use readStream to get the content
// of the request, validate the resulting data, and store it as a comment when it 
// looks valid.

router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
    async (server, title, request) => {
        let requestBody = await readStream(request);
        let comment;
        try { comment = JSON.parse(requestBody); }
        catch (_) { return { status: 400, body: "Invalid JSON" }; }

        if (!comment ||
            typeof comment.author != "string" ||
            typeof comment.message != "string") {
            return { status: 400, body: "Invalid comment" }
        } else if (title in server.talks) {
            server.talks[title].comments.push(comment);
            server.updated();
            return { status: 204 };
        } else {
            return { status: 404, body: `No talk '${title}' found` };
        }
    });

// Long Polling Support

// When a GET request comes in for /talks, it may be a regular request or a long 
// polling request. Because we have to send the array of talks in many places, we
// define a helper function that includes an ETag in the response:

skillShareServer.prototype.talkResponse = function() {
    let talks = [];
    for (let title of Object.keys(this.talks)) {
        talks.push(this.talks[title]);
    }
    return {
        body: JSON.stringify(talks),
        headers: {
            "Content-Type": "application/json",
            "ETag": `"${this.version}"`
        }
    };
};


// The handler itself needs to look at the request headers to see whether If-None-
// Match and Prefer headers are present. Node stores headers, whose names are 
// specified to be case insensitive, under their lowercase names.

router.add("GET", /^\/talks$/, async (server, request) => {
    let tag = /"(.*)"/.exec(request.headers["if-none-match"]);
    let wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);
    if (!tag || tag[1] != server.version) {
        return server.talkResponse();
    } else if (!wait) {
        return { status: 304 };
    } else {
        return server.waitForChanges(Number(wait[1])); // call the server's callback function after the number of seconds in the prefer header
    }
});

// This function first checks if there are ETag and prefer headers, then it checks
// if there is a valid tag that is equal to the server's version number, if there 
// isn't then it returns the list of talks. If there is a valid "if-none-match" 
// tag and it matches the server version and there isn't a wait tag then it just 
// returns a 304 status. Otherwise, if there is a wait tag, it will call the server's 
//0 waitForChanges method with the value of the wait tag.

// Callback functions are stored in the server's waiting array so that they can be
// notified when something happens. The waitForChanges method also immediately sets
// a timer to respond with a 304 status when the request has waited long enough.

skillShareServer.prototype.waitForChanges = function(time) {
    return new Promise(resolve => {
        this.waiting.push(resolve);
        setTimeout(() => {
            if (!this.waiting.includes(resolve)) return;
            this.waiting = this.waiting.filter(r => r != resolve);
            resolve({ status: 304 });
        }, time * 1000);
    });
}

// Registering change with updated increases the version property and wakes up all
// waiting requests.

skillShareServer.prototype.updated = function() {
    this.version++;
    let response = this.talkResponse();
    this.waiting.forEach(resolve => resolve(response));
    this.waiting = [];
};

// We can start an instance of the SkillShareServer and start it on port 8000, the
// resulting HTTP server serves files from the public subdirectory alongside a 
// talk-managing interface under the /talks URL.

new skillShareServer(Object.create(null)).start(8000);


// The Client

// The client-side part of the skill-sharing website consists of three files: an
// HTML page, a style sheet, and a JavaScript file.

// HTML

// It is a widely used convention for servers to to serve a file named index.html 
// when a request is made directly to a path that corresponds to a directory. When 
// a request is made to the path /, the server looks for the file ./public/index.html
// (./public being the root we gave it) and returns that file if found. Thus, if we 
// want a page to show up when a browser is pointed at our server, we should put it 
// in public/index.html. This is our index file:

/*
<!doctype html>
<meta charset="utf-8">
<title>Skill Sharing</title>

<h1>Skill Sharing</h1>

<script src="skillsharing_client.js"></script>
*/

// Actions

// The state of the application consists of the list of talks and the name of the 
// user, which we store in a {talks, user} object. We don't allow the user to 
// directly manipulate the state or send off HTTP requests, instead the user emits
// actions that describe what the user is trying to do.

// The handleAction function takes such an action and makes it happen, because our
// state is so simple, the state changes are handled in the same function.

function handleAction(state, action) {
    if (action.type == "setUser") {
        localStorage.setItem("userName", action.user);
        return Object.assign({}, state, { user: action.user });
    } else if (action.type == "setTalks") {
        return Object.assign({}, state, { talks: action.talks });
    } else if (action.type == "newTalk") {
        fetchOK(talkURL(action.title), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                presenter: state.user,
                summary: action.summary
            })
        }).catch(reportError);
    } else if (action.type == "deleteTalk") {
        fetchOK(talkURL(action.talk), { method: "DELETE" })
            .catch(reportError);
    } else if (action.type == "newComment") {
        fetchOK(talkURL(action.talk) + "/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: state.user,
                message: action.message
            })
        }).catch(reportError);
    }
    return state;
}

// The user's name is stored in localStorage so that it can be restored when the 
// page is loaded. The actions that need to involve the server make network requests,
// using fetch, to the HTTP interface described earlier. We use a wrapper function, 
// fetchOK, which makes sure the returned promise is rejected when the server
// returns an error code.

function fetchOK(url, options) {
    return fetch(url, options).then(response => {
        if (response < 400) return response;
        else throw new Error(response.statusText);
    });
}

// This helper function is used to build up a URL for a talk with a given title.

function talkURL(title) {
    return "talks/" + encodeURIComponent(title);
}

// When the request fails, we want the user to be informed instead of having our
// page show no notification of the failure. So we define a function called
// reportError, which shows a dialog that tells the user something went wrong.

function reportError(error) {
    alert(String(error));
}

// Rendering Components

// Here we break the application down into components, some as classes, but those
// that never update or are always redrawn when updated, as functions that directly
// return a DOM node. E.g. the following is a component that shows the field where
// the user can enter their name:

function renderUserField(name, dispatch) {
    elt("label", {}, "Your name: ", elt("input", {
        type: "text",
        value: name,
        onchange(event) {
            dispatch({ type: "setUser", user: event.target.value });
        }
    }));
}

// The following is used to render talks, which includes a list of comments and
// a form for adding a new comment.

function renderTalk(talk, dispatch) {
    return elt(
        "section", { className: "talk" },
        elt("h2", null, talk.title, " ", elt("button", {
            type: "button",
            onclick() {
                dispatch({ type: "deleteTalk", talk: talk.title });
            }
        }, "Delete")),
        elt("div", null, "by ",
            elt("strong", null, talk.presenter)),
        elt("p", null, talk.summary),
        ...talk.comments.map(renderComment),
        elt("form", {
            onsubmit(event) {
                event.preventDefault();

                let form = event.target;
                dispatch({
                    type: "newComment",
                    talk: talk.title,
                    message: form.elements.comment.value
                });
                form.reset();
            }
        }, elt("input", { type: "text", name: "comment" }), " ",
            elt("button", { type: "submit" }, "Add comment")));
}


// The submit event handler calls form.reset to clear the form's content after 
// creating a newComment action. 

// The method we are using to render our program is long and verbose. An alternative
// is to use a JavaScript extension called JSX that allows you to write HTML in 
// your JavaScript.

function renderComment(comment) {
    return elt("p", {className: "comment"},
            elt("strong", null, comment.author),
            ": ", comment.message);
}

// The form that users can use to create a new talk is rendered like so:

function renderTalkForm(dispatch) {
    let title = elt("input", {type: "text"});
    let summary = elt("input", {type: "text"});
    return elt("form", {
        onSubmit(event) {
            event.preventDefault();
            dispatch({type: "newTalk",
                    title: title.value,
                    summary: summary.value});
            event.target.reset();
        }
    }, elt("h3", null, "Submit a Talk"),
        elt("label", null, "Title: ", title),
        elt("label", null, "Summary: ", summary),
        elt("button", {type: "submit"}, "Submit"));
}

    // Polling

// To start the app we need the current list of talks. Here we wrap the long polling
// process with the initial load of talks since they are closely related. We take 
// the ETag from the load and set it for future loads.

async function pollTalks(update) {
    let tag = undefined;
    for(;;) {
        let response;
        try {
            response = await fetchOK("/talks", {
                headers: tag && {"If-None-Match": tag,
                                "Prefer": "wait=90"}
            });
        } catch (e) {
            console.log("Request failed: " + e);
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
        }
        if (response.status == 304) continue;
        tag = response.headers.get("ETag");
        update(await response.json());
    }
}

// This is an async function so that looping and waiting for the request is easier.
// It runs an inifinite loop that, on each iteration, retrieves the list of talks
// - either normally or, if this isn't the first request, with the headers included
// that make it a long polling request.

// When a request fails, it waits a moment and then tries again. The promise 
// resolved via setTimeout is a way to force the async function to wait. 

// When the server gives back a 304 response, that means a long polling request
// timed out, so the fucntion should just immediately start the next request. If
// the response is a normal 200 response, its body is read as JSON and passed to
// the callback, and its ETag header value is stored for the next iteration.


    // The Application

// The following component ties the whole user interface together:

class SkillShareApp {
    constructor(state, dispatch) {
        this.dispatch = dispatch;
        this.talkDOM = elt("div", {className: "talks"});
        this.dom = elt("div", null,
                        renderUserField(state.user, dispathch),
                        this.talkDOM,
                        renderTalkForm(dispatch));
        this.syncState(state);
    }

    syncState(state) {
        if (state.talk != this.talks) {
            this.talkDOM.textContent = "";
            for (let talk of state.talks) {
                this.talkDOM.appendChild(
                    renderTalk(talk, this.dispatch));
            }
            this.talks = state.talks;
        }
    }
}

function runApp() {
    let user = localStorage.getItem("userName") || "Anon";
    let state, app;
    function dispatch(action) {
        state = handleAction(state, action);
        app.syncState(state);
    }
    pollTalks(talks => {
        if (!app) {
            state = { user, talks };

            app = new SkillShareApp(state, dispatch);
            document.body.appendChild(app.dom);
        } else {
            dispatch({ type: "setTalks", talks });
        }
    }).catch(reportError);
}

// We can start the application like this:

runApp();
