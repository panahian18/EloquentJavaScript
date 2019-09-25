        // Chapter 18 - HTTP and Forms

// The Hypertext Transfer Protocol is the mechanism through which data is
// requested and provided on the world wide web.

    // The Protocol

// When eloquentjavascript.net/18_http.html is entered into a browser's address
// bar, the browser first looks up the address of the server associated with
// eloquentjavascript.net and tries to open a TCP connection to it on port 80, the
// default port for HTTP traffic. If the server exists and accepts the connection,
// the browser might send something like this:

/*
GET /18_http.html HTTP/1.1
Host: eloquentjavascript.net
User-Agent: Your browser's name
*/

// Then the server responds, through that same connection.

/*
HTTP/1.1 200 OK
Content-Length: 65585
Content-Type: text/html
Last-Modified: Mon, 08 Jan 2018 10:29:45 GMT

<!doctype html>
... the rest of the document
*/

// The browser takes the part of the response after the blank line, its body not
// the HTML body tag and displays it as an HTML document. The information sent
// by the client is called the request, it starts with:

    // GET /18_http.html HTTP/1.1

// GET is the method of the request, it means we want to get the specified
// resource. Other common methods are DELETE to delete a resource, PUT to create
// or replace it, and POST to send information to it. A server does not have to
// carry out every request it gets, e.g. request DELETE to a server's main page.

// The part after the method name is the path of the resource the request applies
// to. A resource can be a file on the server, but it doesn't have to be. Servers
// will often generate the responses they produce on the fly. E.g. looking a user's
// account on GitHub will check the database for their username and retrieve the page.

// The HTTP/1.1 inidcates the version of the HTTP protocol it's using. Many browsers
// now use version 2, but browsers will automatically switch to the appropriate
// protocol version when talking to a given server, and the outcome of a request
// is the same regardless of version used.

// THe server's response will start with a version as well, followed by the status
// of the response, first as a 3 digit status code and then as a human-readable
// string. E.g.:

    // HTTP/1.1 200 OK

// Codes starting with 2 mean the request succeeded, codes starting with 4 mean
// that there was something wrong with the request, 404 is the most famous one,
// meaning that the resource could not be found. Codes that start with 5 mean
// that an error happened on the server and the request is not to blame.

// The first line of a request or response may be followed by any number of
// headers. These are lines in the form name: value that specify extra info
// about the request or response. These headers were part of the example
// response:

    Content-Length: 65585
    Content-Type: text/html
    Last-Modified: Thu, 04, Jan 2018 14:05:30 GMT

// This tells us that the type of the document is HTML and the size is 65585
// bytes. It also says when it was last modified. For most headers, the client
// or server are free to decide whether to include them. However, some are
// required. The Host header, which specifies the hostname should be included
// in the request because a server might be serving multiple hostnames on a
// single IP address.

// After the headers, both request and response may include a blank line, followed
// by a body, which contains the data being sent. GET and DELETE requests don't
// send along any data, but PUT and POST do.

    // Browsers and HTTP

// When a url is entered in a browser address bar, the browser makes a request,
// the resulting HTML document may reference other files, such as images and
// javaScript files, if so, those are retrieved too. This may include hundreds
// of files, browsers make requests concurrently to speed this process up.

// HTML pages may also include forms, which allow users to fill out information
// and send it to the server. This is an example of a form.

/*
<html>
<form method="GET" action="example/message.html">
    <p>Name: <input type="text" name="name"></p>
    <p>Message:<br><textarea name="message"></textarea></p>
    <p><button type="submit">Send</button></p>
</form>
</html>
*/

// The above describes 2 fields, one small asking for a name and a larger
// one to write a message in. When you click the Send button, the form is
// "submitted", meaning that the content of its field is packed into an HTTP
// request and the browser navigates to the result of that request.

// When the form element's method attribute is GET (or is omitted), the
// information in the form is added to the end of the action URL as a query string.
// The browser might make a request to this URL:

    // GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1

// The question mark indicates the end of the path part of the URL and the start
// of the query. It is followed by pairs of names and values, corresponding to
// the name attribute on the form field elements and the content of those elements.
// An ampersand(&) is used to separate those pairs.

// The actual message encoded in the URL is "Yes?", but the question mark is
// replaced by a strange code. Some characters in query strings must be escaped.
// URL has its own format called URL encoding, which uses a percent sign followed
// by 2 hexadecimal digits (base 16) that encode the character code. E.g. ? is
// represented as %3F. The functions encodeURIComponent and decodeURIComponent
// are used to encode and decode this format:

console.log(encodeURIComponent("Yes?"));
// -> Yes%3F
console.log(decodeURIComponent("Yes%3F"));
// -> Yes?

// If we change the method attribute of the HTML form to POST, the HTTP request made
// to submit the form will use the POST method and put the query string in the
// body of the request, rather than adding it to the URL.

POST /example/message.html HTTP/1.1
Content-length: 24
Content-type: application/x-www-form-urlencoded

name=Jean&message=Yes%3F

// GET requests should be used for requests that do not have side effects but
// simply ask for information. Requests that change something on the server,
// for example creating a new account or posting a message, should be expressed
// with other methods, such as POST.

    // Fetch

// The interface through which browser JavaScript can make HTTP requests is
// called fetch, which uses Promises. E.g.

fetch("example/data.text").then(response => {
    console.log(response.status);
    // -> 200
    console.log(response.headers.get("Content-Type"));
    // -> text/plain
});

// The promise returns a response object holding information about the server's
// response, including status code and headers. The headers are wrapped in a 
// Map-like object that treats its keys as case-insensitive.

// The first argument to fetch is the URL that should be requested. When that
// path doesn't start with a protocol name (such as http:), it is treated as
// relative, which means that it is interpreted relative to the current document.
// When it starts with /, it replaces the current path, which is the part after
// the server name. When it does not, the part of the current path up to and
// including its last slash character is put in front of the relative URL.

// To get the actual content of a response, you can use its text method. This
// method also returns a promise because the initial promise is resolved as
// soon as the headers arrive, but the body might take a while longer.

fetch("example/data.txt")
    .then(resp => resp.text())
    .then(text => console.log(text));
    // -> The actual content of data.txt

// A similar method, called json, returns a promise that resolves to the value
// you get when parsing the body as JSON or rejects if it's not valid JSON.

// By default, fetch uses the GET method to make its request and does not
// include a request body. You can configure it differently by passing an object
// with extra options as a second argument. E.g. this request tries to delete
// example/data.txt. The 405 status code means "method not allowed".

fetch("example/data.txt", {method: "DELETE"}).then(resp => {
    console.log(resp.status);
});

// To add a request body, you can include a body option. To set headers, there's
// the headers option. For example, this request includes a Range header, which
// instructs the server to return only part of a response.

fetch("example/data.txt", {headers: {Range: "bytes=8-19"}})
    .then(resp => resp.text())
    .then(console.log);
    // -> the content

// The browser will automatically add some request headers, such as "Host" and
// those needed for the server to figure out the size of the body. But adding
// your own headers is often useful.

    // HTTP Sandboxing

// Due to security concerns, browsers do not allow scripts to make HTTP requests
// to other domains (e.g. themafia.org to mybank.com). However, this can
// prevent servers from making legitimate uses of cross-domain scripting. Servers
// can include a header like this in their response to indicate to the browser
// that it is okay for the request to come from another domain.

Access-Control-Allow-Origin: *

    // Appreciating HTTP

// When building a system that requires communication between a JavaScript program
// running in the browser and a program running on a server, there are several
// ways to model this communication.

// The first model, called remote procedure calls, follows the pattern of normal
// function calls, except that the function is actually running on another machine.
// Calling it involves making a request to the server that includes the function
// name and arguments. The response to that request contains the returned value.

// When thinking in terms of RPCs, HTTP is just a vehicle for communicaton, as
// there will like be an abstraction layer written on top of it.

// The second model builds the communication around the concept of resources
// and HTTP methods. Instead of a remote procedure called addUser, you use a PUT
// request to /users/larry. Instead of encoding that user's properties in a
// function argument, you define a JSON document format (or use an existing
// format) that represents a user.  A resource is fetched by making a GET request
// to the resources URL (e.g. /user/larry), which again returns the document
// representing the resource.

// The second approach makes it easier to use some of the features that HTTP
// provides, such as support for caching resources (keeping a copy on the client
// side for fast access). The concepts used in HTTP, provide a helpful set of
// principles to design your server interface around.

    // Security and HTTPS

// Data travelling over the internet usually travels a long way to reach its
// destination. This exposes it to many malicious users who may inspect or
// modify the data. Using plain HTTP is not sufficiently secure when transfering
// sensitive data.

// The secure HTTP protocol, HTTPS, wraps HTTP traffic in a way that makes it
// more secure. First, it authenticates the server by asking it to prove its
// identity by proving it has a cryptographic certificate issued by a certificate
// authority that the browser recognizes. Next, all data going over the connection
// is encrypted.

    // Form Fields

// Form fields were designed to allow users to send information as an HTTP request.
// They were originally designed such that interaction with the server always
// happens by navigating to a new page. However, their elements are part of the
// DOM, and DOM elements that represent form fields support a number of properties
// and events that are not present on other elements. This allows us to inspect and 
// control input fields with JS programs and do things such as adding new functionality 
// to a form or using forms and fields as building blocks in a JS application.

// A web form consists of any number of input fields grouped in a <form> tag.
// HTML allows several different styles of fields, ranging from on/off checkboxes,
// to drop-down menus, and fields for text input. A lot of field types use the
// <input> tag. This tag's type attribute is used to select the field's style. These
// are some of the <input> types:

    // text         A single-line text field
    // password     Same as text but hides the text that is typed
    // checkbox     An on/off switch
    // radio        Part of a multiple choice field
    // file         Allows the user to choose a file from their computer

// Form fields do not have to appear in a <form> tag. They can appear anywhere in
// a page. Such form-less fields cannot be submitted (only a whole form can), but
// when responding to input with JS, we often don't want to submit our fields
// normally anyway.

<p><input type="text" value="abc"> (text)</p>
<p><input type="password" value="abc"> (password)</p>
<p><input type="checkbox" checked> (checkbox)</p>
<p><input type="radio" value="A" name="choice">
    <input type="radio" value="A" name="choice" checked>
    <input type="radio" value="B" name="choice"> (radio)</p>
<p><input type="file"> (file)</p>

// The JavaScript interface for such elements differs with the type of the element.
// Multiline text fields have their own tag, <textarea>, which uses the text between
// the two tags as starting text.

<textarea>
one
two
three
</textarea>

// The <select> tag is used to create a field that allows the user to select from
// a number of predefined options.

<select>
    <option>Pancakes</option>
    <option>Pudding</option>
</select>

// Whenever the value of a form field changes, it will fire a "change" event.

    // Focus

// Form fields can get "keyboard focus", which means that when they are clicked
// or activated in some other way, they become the currently active element and
// the recipient of keyboard input. Thus, you can type into a text field only
// when it is focused.

// Other fields respond differently to keyboard events, e.g. a <select> menu tries
// to move the option that contains the text the user typed and responds to the
// arrow keys by moving its selection up and down.

// We can control focus from JavaScript with the focus and blur methods. The first
// moves focus to the DOM element it is called on, and the second removes focus.
// The value in document.activeElement corresponds to the currently focused element.

<input type="text">
<script>
    document.querySelector("input").focus();
    console.log(document.activeElement.tagName):
    // -> INPUT
    document.querySelector("input").blur();
    console.log(document.activeElement.tagName);
    // -> BODY
</script>

// For some pages, the user is expected to want to interact with a form field
// immediately. JavaScript can be used to focus on this form field immediately
// when the page is loaded, but HTML also provides the autofocus attribute, which
// produces the same effect.

// Browsers also allow the user to move the focus through the document by pressing
// the TAB key. We can change the order in which elements receive focus with the
// tabindex attribute. E.g. this allows us to skip the help link:

<input type="text" tabindex=1> <a href=".">(help)</a>
<button onclick="console.log('ok')" tabindex=2>OK</button>

// By default, most types of HTML elements cannot be focused. But you can add a
// tabindex attribute to any element that will make it focusable. A tabindex
// of -1 makes tabbing skip over an element, even if it is normally focusable.

    // Disabled Fields

// All form fields can be disabled through their disabled attribute. It is an
// attribute that can be specified without value, disabled fields cannot be
// focused or changed. e.g.

<button>Working button</button>
<button disabled>I'm out</button>

// This may be useful when a program is in the process of handling an action caused
// by a button that might require communicating with the server that happens to
// be taking a long time. By disabling the button, we can ensure that the user won't
// click on the button again, out of impatience.

    // The Form as a Whole

// When a field is in a <form> element, its DOM element will have a form property
// linking back to the form's DOM element. The <form> element, in turn, has a
// property called elements that cotnains an array-like collection of the fields
// inside it.

// The name attribute of a form field determines the way its value will be identified
// when the form is submitted. It can also be used as a property name when accessing
// the form's elements property, which acts both as an array-like object (accessible
// by number) and a map (accessible by name).

<form action="example/submit.html">
    Name: <input type="text" name="name"><br>
    Password: <input type="password" name="password"><br>
    <button type="submit">Log in</button>
</form>
<script>
    let form = document.querySelector("form");
    console.log(form.elements[1].type);
    // -> password
    console.log(form.elements.password.type);
    // -> password
    console.log(form.elements.name.form == form);
    // -> true
</script>

// A button with a type attribute of submit, when pressed, will cause the form to
// be submitted, which is the same as pressing enter when the form field is focused.

// When a form is submitted, the browser navigates to the page indicated by the
// form's action attribute, using either a GET or POST request. But before that
// happens, a submit event is fired. You can handle this with JS and prevent the
// default behaviour by calling preventDefault on the event object.

<form action="example/submit.html">
    Value: <input type="text" name="value">
    <button type="submit">Save</button>
</form>
<script>
    let form = document.querySelector("form");
    form.addEventListener("submit", event => {
        console.log("Saving value", form.elements.value.value);
        event.preventDefault();
    });
</script>

// We can interrupt submit events for various reasons, one is to verify that users
// have submitted information that makes sense, and to show errors immediately
// instead of submitting wrong information. Or we can disable the regular way
// of submitting the form completely, and have our program handle the input,
// by using fetch to send it to a server without reloading the page.

    // Text Fields

// Fields created with <textarea> or <input> tags with a type of text or password
// share a common interface. Their DOM elements have a value property that holds
// their current content as a string value, which we can set to another string
// that changes the field's content.

// The selectionStart and selectionEnd properties of text fields give us information
// about the cursor and selection in the text. When nothing is selected, these
// two properties are the same. But if some text is selected, then the two properties
// will differ, giving us the start and end of the selected text. These values may
// also be written to.

// This script will allow you to insert the name "Khasekhemwy" into the text field
// by pressing F2.

<textarea></textarea>
<script>
    let textarea = document.querySelector("textarea");
    textarea.addEventListener("keydown", event => {
        // The keycode for F2 happens to be 113
        if (event.keyCode == 113) {
            replaceSelection(textarea, "Khasekhemwy");
            event.preventDefault();
        }
    });
    function replaceSelection(field, word) {
        let from = field.selectionStart, to = field.selectionEnd;
        field.value = field.value.slice(0, from) + word +
                      field.value.slice(to);
        // Put the cursor after the word
        field.selectionStart = from + word.length;
        field.selectionEnd = from + word.length;
    }
</script>

// The replaceSelection function replaces the currently selected part of a text
// field's content with the given word and then moves the cursor after that word
// so that the user can continue typing.

// The "change" event for a text field does not fire every time something is typed.
// Instead, it fires when the field loses focus after its content was changed.
// To respond immediately to changes in a text field, register an event handler
// for the "input" event instead, which fires for every time the user types a
// character, deletes text, or otherwise manipulates the field's content.

// The following example shows a text field and a counter displaying the current
// length of the text in the field:

<input type="text"> length: <span id="length">0</span>
<script>
    let text = document.querySelector("input");
    let output = document.querySelector("#length");
    text.addEventListener("input", () => {
        output.textContent = text.value.length;
    });
</script>

    // Checkboxes and radio buttons

// A checkbox field is a binary toggle. Its value can be extracted or changed
// through its checked property, which holds a Boolean value.

<label>
    <input type="checkbox" id="purple">Make this page purple
</label>
<script>
    let checkbox = document.querySelector("#purple");
    checkbox.addEventListener("change", () => {
        document.body.style.background =
            checkbox.checked ? "mediumpurple" : "";
    });
</script>

// The <label> tag associates a piece of document with an input field. Clicking
// anywhere on the label will activate the field, which focuses it and toggles its
// value when it is a checkbox or radio button.

// A radio button is similar to a checkbox, but it's implicitly linked to other
// radio buttons with the same name attribute so that only one of them can be
// active at any time.

Color:
<label>
    <input type="radio" name="color" value="orange"> Orange
</label>
<label>
    <input type="radio" name="color" value="lightgreen"> Green
</label>
<label>
    <input type="radio" name="color" value="lightblue"> Blue
</label>
<script>
    let buttons = document.querySelectorAll("[name=color]");
    for (let buttons of Array.from(buttons)) {
        button.addEventListener("change", () => {
            document.body.style.background = button.value;
        });
    }
</script>

// The square brackets in the CSS query given to querySelectorAll are used to
// match attributes. It selects elements whose name attribute is "color".

    // Select fields

// Select fields are similar to radio buttons, as they allow the user to choose
// from a set of options. But where a radio button puts the layout of the options
// under our control, the appearance of a <select> tag is determined by the browser.
// Select fields also have a variant that is more akin to checkboxes than radio
// buttons. When given the multiple attribute, a <select> tag will allow the user
// to select any number of options, rather than just a single option. Most browsers
// will display this differently than a select field, which is just drop down.

// Each <option> tag has a value. This value can be defined with a value attribute.
// When that is not given, the text inside the option will count as its value. The
// value property of a <select> element reflects the currently selected option.
// The option tags for a <select> field can be accessed as an array-like object
// through the field's options property. Each option has a property called selected,
// which indicates whether that option is selected.

<select multiple>
    <option value="1">0001</option>
    <option value="2">0010</option>
    <option value="4">0100</option>
    <option value="8">1000</option>
</select> = <span id="output">0</span>
<script>
    let select = document.querySelector("select");
    let output = document.querySelector("#output");
    select.addEventListner("change", () => {
        let number = 0;
        for (let option of Array.from(select.options)) {
            if (option.selected) {
                number += Number(option.value);
            }
        }
        output.textContent = number;
    });
</script>

    // File fields

// File fields are a way to read files from a user's machine and to read files
// from JavaScript programs. The field acts as a kind of gatekeeper. The script
// cannot simply start reading private files from the user's computer, but if
// the user selects a file in file field, then the browser considers that a
// readable file.

<input type="file">
<script>
    let input = document.querySelector("input");
    input.addEventListener("change", () => {
        if (input.files.length > 0) {
            let file = input.files[0];
            console.log("You chose", file.name);
            if (file.type) console.log("It has type", file.type);
        }
    });
</script>

// The files property of a file field is an Array-like object, containing the
// files chosen in the field. The reason there isn't a file property is that
// the file fields also supports a "multiple" attribute, which makes it possible
// to select multiple files at the same time.

// Objects in the files object have properties such as name, size, and type (e.g.
// text/plain or image/jpeg). However, it does not have a property that contains
// the content of the file.

// Reading a file is done by creating a FileReader object, registering a "load"
// event handler for it, and calling its readAsText method, giving it the file
// we want to read. Once loading finishes, the reader's result property contains
// the file's content. FileReaders also fire an "error" event when reading the
// file fails for any reason. The error object itself will end up in the reader's
// error property.

<input type="file" multiple>
<script>
    let input = document.querySelector("input");
    input.addEventListener("change", () => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            console.log("File", file.name, "starts with",
                          reader.result.slice(0, 20));
        });
        reader.readAsText(file);
    });
</script>

// It can also be wrapped in a promise like this:

function readFileText(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListner(
            "load", () => resolve(reader.result));
        reader.addEventListner(
            "error", () => reject(reader.error));
        reader.readAsText(file);
    });
}

    // Storing data client-side

// So far, we have looked at simple HTML pages, which are useful for small apps.
// However, these applicaitons cannot hold data between sessions, as JavaScript
// bindings will be thrown out every time the page is closed. Another method of
// data storage is the use of the localStorage object, which can survive page reloads.

localStorage.setItem("username", "marjin");
console.log(localStorage.getItem("username"));
// -> marijn
localStorage.removeItem("username");

// A value in localStorage persists until it is overwritten, removed with
// removeItem, or the user clears their local data.

// Sites from different domains get different storage compartments. That means
// data stored in localStorage by a given website can, in principle, be read(and
// overwritten) only by scripts on that same site.

// The following is a simple note-taking application.

Notes: <select></select> <button>Add</button><br>
<textarea style="width: 100%"></textrea>

<script>
    let list = document.querySelector("select"); // Binding for the select element
    let note = document.querySelector("textarea"); // Binding for the notepad

    let state;
    function setState(newState) {
        list.textContent = ""; // Initially, the select note drop menu is blank
        for (let name of Object.keys(newState.notes)) { // Iterate through names of notes
            let option = document.createElement("option"); // For each note in the state, create an option tag for it
            option.textContent = name; // Create the appropriate label for the drop menu option
            if (newState.selected == name) option.selected = true; // Check if the current option is the selected one
            list.appendChild(option);
        }
        note.value = newState.notes[newState.selected]; // Show the appropriate note

        localStorage.setItem("Notes", JSON.stringify(newState)); // Store the state in local storage
        state = newState; // update the state
    }
    setState(JSON.parse(localStorage.getItem("Notes")) || { // call setState with the given state or with a default state
        notes: {"shopping list": "Carrots\nRaisins"},
        selected: "shopping list"
    });

    // This event handler is for changes in the list, i.e. when a different note gets selected
    list.addEventListener("change", () => { // Here we handle changes in the note that is selected
        setState({notes: state.notes, selected: list.value}); // Update the state with the new selected value
    });

    // This event handler is for changes in the note, i.e. when someone writes in the notepad
    note.addEventListner("change", () => {
        setState({
            notes: Object.assign({}, state.notes, {[state.selected]: note.value}), // Create a new object, with the values of the 2nd and the 3rd argument is added or overwrites the old one
            selected: state.selected  // Use the same value for state.selected
        });
    });
    document.querySelector("button")
        .addEventListner("click", () => {
            let name = prompt("Note name"); // Ask the user for a note name
            if (name) setState({ // If the name is valid, update the state
                notes: Object.assign({}, state.notes, {[name]: ""}), // Add a new blank note
                selected: name
            });
        });
</script>

// sessionStorage is an alternative to localStorage, which only saves data for the
// current sessions, so whenever the browser is closed, the data is lost.

    // Summary
