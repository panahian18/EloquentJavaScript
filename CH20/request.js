// To act as an HTTP client, we can use the request function in the http module
const {request} = require("http");
let requestStream = request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, response => {
        console.log("Server responded with status code",
            response.statusCode);
});
requestStream.end();
