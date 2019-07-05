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
    catch (_) { return { status: 400, body: "invalid JSON" }; }
    if (!talk || typeof
        talk.presenter != "string" ||
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
// of the request, validate the resulting data, and store it as a comment when it looks
// valid.

router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
    async (server, title, request) => {
        let requestBody = await readStream(request);
        let comment;
        try { comment = JSON.parse(requestBody); }
        catch (_) { return { status: 400, body: "Invalid JSON" } }

        if (!comment ||
            typeof comment.author != "string" ||
            typeof comment.message != "string") {
            return { status: 400, body: "Invalid comment" }
        } else if (title in server.talks) {
            server.talks[title].comment.push(comment);
            server.updated();
            return { status: 204 };
        } else {
            return { status: 404, body: `No talk in '${title}' found` };
        }
    });

// Long Polling Support

// When a GET request comes in for /talks, it may be a regular request or a long 
// polling request. Because we have to send the array of talks in many places, we
// define a helper function that includes an ETag in the response:

skillShareServer.prototype.talkResponse = function () {
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
// is then it returns the list of talks. If version is not current and there is no
// prefer header, the server returns a response with a 304 status. Otherwise, with 
// a valid prefer header, it will call the waitForChanges function with the 
// appropriate number of seconds to wait.

// Callback functions are stored in the server's waiting array so that they can be
// notified when something happens. The waitForChanges method also immediately sets
// a timer to respond with a 304 status when the request has waited long enough.

skillShareServer.prototype.waitForChanges = function (time) {
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

skillShareServer.prototype.updated = function () {
    this.version++;
    let response = this.talkResponse();
    this.waiting.forEach(resolve => resolve(response));
    this.waiting = [];
};

// We can start an instance of the SkillShareServer and start it on port 8000, the
// resulting HTTP server serves files from the public subdirectory alongside a 
// talk-managing interface under the /talks URL.

new skillShareServer(Object.create(null)).start(8000);

