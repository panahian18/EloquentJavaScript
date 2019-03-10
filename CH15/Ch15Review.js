        // Chapter 15 - Handling Events

    // Event Handlers

// Detecting when a user presses a key is an important aspect of handling inputs.
// Previous methods relied on detecting when a key was being pressed, which
// required constant reading of the key's state in order to catch it being pressed.
// Another method, called polling, would detect key presses and put that event
// in a queue, then constantly checking that queue, however this method can
// easily lead to a feeling of unresponsiveness.

// A better method is for the system to actively notify our code when an event
// occurs. Browsers do this by allowing us to register functions as handlers for
// specific events.

// The window binding, provided by the browser, refers to a built-in object
// that represents the browser window that contains the document. Calling its
// addEventListener method registers a second argument to be called everytime
// the event described by the first argument occurs.

<p>Click this document to activate the handler.</p>
<script>
    window.addEventListener("click", () => {
        console.log("You knocked?");
    });
</script>

    // Events and DOM Nodes

// Event listeners are registered in a specific context. The example above uses
// the context of the window. However, we can add eventListeners in any DOM
// element, and some other types of objects. Event listeners are only called
// when the event happens in the context of the object they are registered on.

// This example attaches a handler to the button node, but not the rest of the document
<button>Click me</button>
<p>No handler here.</p>
<script>
    let button = document.querySelectorAll("button");
    button.addEventListener("click", () => {
        console.log("Button clicked");
    });
</script>

// You can also give a node an "onClick" attribute, but you can only add one
// event handler that way. The addEventListener can take an arbitrary amount of
// event handlers. The removeEventListener works similar to the addEventListener.

<button>Act-once button</button>
<script>
    let button = document.querySelectorAll("button");
    function once() {
        console.log("Done.");
        button.removeEventListener("click", once);
    }
    button.addEventListener("click", once);
</script>

    // Event Objects

// Event handler functions are also passed an argument, the event object. This
// object holds additional information about the event. E.g. if we want to know
// which mouse button was clicked, we would have to look at the event object.
// Different event types have different event objects, although every event
// object has a type event with a string identifying the event type (e.g. "clicK")

<button>Click me any way you want</button>
<script>
    let button = document.querySelectorAll("button");
    button.addEventListener("mousedown", event => {
        if (event.button == 0) {
            console.log("Left button");
        } else if (event.button == 1) {
            console.log("Middle button");
        } else if (event.button == 2) {
            console.log("Right button");
        }
    });
</script>

    // Propagation

// For most event types, handlers registered on nodes with children will also
// receive events that happen in the children. E.g. if a button inside a paragraph
// is clicked, the paragraph will also see the click event. But if both parent
// and child nodes have a handler, the more specific handler, the one on the
// button will get to go first. The event is said to propagate outward, from the
// node where it happened to the parent node and on to the document root. Finally,
// the handlers registered on the whole window will get their turn to respond.

// At any point, an event handler can call the stopPropagation method on the event
// object to prevent handlers further up from receiving it. This is useful for
// when you have a button inside another clickable element and you don't want
// clicks from the button to affect the outer element's click behaviour.

// The following registers "mousedown" handlers on both a button and the paragraph
// around it. When the button is clicked with the right button, it will call
// stopPropagation, which will prevent the handler on the paragraph from running
// When the button is clicked with another mouse button, both handlers will run.

<p>A paragraph with a <button>button</button>.</p>
<script>
    let para = document.querySelectorAll("p");
    let button = document.querySelectorAll("button");
    para.addEventListener("mousedown", () => {
        console.log("Handler for paragraph");
    });
    button.addEventListener("mousedown", event => {
        console.log("Handler for button");
        if (event.button == 2) event.stopPropagation();
    });
</script>

// Most event objects have a target property that refers to the node where they
// originated. You can use this property to ensure that you're not accidentally
// handling something propagated from a node you do not want to handle.

// You can also use target to cast a wide net for a specific type of event. E.g.
// if you have several buttons within a node, it may be easier to register an
// event handler on the outer node and have it use the target property to figure
// if a button was called.

<button>A</button>
<button>B</button>
<button>C</button>
<script>
    document.body.addEventListener("click", event => {
        if (event.target.nodeName == "BUTTON") {
            console.log("clicked", event.target.textContent);
        }
    });
</script>

    // Default Actions

// Many events have a default action associated with them. If you click a link,
// you will be taken to the link's target, etc. For most types of events, the
// JavaScript event handlers are called before the default behaviour takes place.
// If the handler doesn't want this default behaviour to happen, because it has
// already handled the event, then you can call the preventDefault method on the
// event object.

// This can be used to implement your own keyboard shortcuts or context menu.
// It can also be used to obnoxiously interfere with the behaviour that users
// expect. Some events cannot be intercepted at all, e.g. closing tabs on chrome.

// Here is a link that cannot be followed:
<a href="https://developer.mozilla.org/">MDN</a>
<script>
    let link = document.querySelector("a");
    link.addEventListener("click", event => {
        console.log("Nope.");
        event.preventDefault();
    });
</script>

    // Key Events

// When a key on a keyboard is pressed, your browser fires a "keydown" event.
// When it is released, you get a "keyup" event.

<p>This page turns violet when you hold the V key.</p>
<script>
    window.addEventListener("keydown", event => {
        if (event.key == "v") {
            document.body.style.background = "violet";
        }
    });
    window.addEventListener("keyup", event => {
        if (event.key == "v") {
            document.body.style.background = "";
        }
    });
</script>

// The keydown event not only fires when the key is pressed down, but also if
// the key is held, then it fires everytime the key repeats. This fact requires
// caution, e.g. if you add a button to the DOM when a key is pressed and remove
// it again when the key is released, then you might add hundreds of keys when the
// key is held long.

// Just like we use the key property of key events to check to see what key is
// being pressed, we can use that same property to see if special keys such as
// ENTER are being pressed, e.g. pressing the ENTER key will result in a key
// event with the key value being a string "Enter". Modifier keys such as SHIFT,
// CONTROL, ALT, and META, will generate key events just like normal keys. But
// you can also look to see if these keys are being pressed by checking the
// shiftKey, ctrlKey, altKey, and metaKey properties.

<p>Press Control-Space to continue.</p>
<script>
    window.addEventListener("keydown", event => {
        if (event.key == " " && event.ctrlKey) {
            console.log("Continuing!");
        }
    });
</script>

// The DOM node where a key event originates depends on the element that has
// focus when the key is pressed. Most nodes cannot have focus unless you
// give them a tabindex attribute, but things like links, buttons, and form
// fields can. When nothing in particular has focus, document.body acts as the
// target of key events.

// When the user is typing text, it is problematic to use key events to figure
// out what is being typed. Some platforms, like Android's virtual keyboard don't
// fire key events. Even old-fashioned keywords, when using certain types of text
// input, don't match key presses in a straightforward way, e.g. input method
// editor (IME) software allows users to combine key strokes into single characters.

// To notice when something was typed, elements that you can type into such as
// the <input> and <textarea> tags, fire "input" events whenever the user changes
// their content. To get the actual content that was typed, it is best to directly
// read it from the focused field.

    // Pointer Events

// There are 2 widely used ways to point to things on a screen: mice & touchscreens.

    // Mouse Clicks

// Pressing a mouse button causes several events to fire. The "mousedown" and
// "mouseup" events are similar to "keydown" and "keyup" and fire when the button
// is pressed and released. These happen on the DOM node that are immediately
// below the mouse pointer when the event occurs.

// After the "mouseup" event, a "click" event fires on the most specific node
// that contained both the press and release of the button. E.g. if you press
// down on one paragraph and release on another, then the "click" event will
// happen on the element that contains both paragraphs. If 2 clicks happen
// close together, a "dbclick" event also fires, after the second click event.

// To find the precise information about the place where a mouse event happened,
// you can look at its clientX and clientY properties, which contain information
// about the event's coordinates (in pixels) relative to the top-left corner of
// the window, or pageX and pageY, which are relative to the top-left corner of
// the rendered page (which may change when the window has been scrolled).

// The following implements a simple drawing program
<style>
    body {
        height: 200px;
        background: beige;
    }
    .dot {
        height: 8px; width: 8px;
        border-radius: 4px; /* rounds corners */
        background: blue;
        position: absolute;
    }
</style>
<script>
    window.addEventListener("click", event => {
        let dot = document.createElement("div");
        dot.className = "dot";
        dot.style.left = (event.pageX - 4) + "px";
        dot.style.top = (event.pageY - 4) + "px";
        document.body.appendChild(dot);
    });
</script>

    // Mouse Motion

// Every time the mouse pointer moves, a "mousemove" event is fired. This event
// can be used to track the position of the mouse. This is useful when implementing
// some form of mouse-dragging functionality. This program displays a bar and
// sets up event handlers so that dragging to the left or right on the bar makes
// it narrower or wider:

<p>Drag the bar to change its width:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>

<script>
    let lastX;
    let bar = document.querySelector("div");
    bar.addEventListener("mousedown", event => {
        if (event.button == 0) {
            lastX = event.clientX;
            window.addEventListener("mousemove", moved);
            event.preventDefault(); // Prevent selection
        }
    });

    function moved(event) {
        if (event.buttons == 0) {
            window.removeEventListener("mousemove", moved);
        } else {
            let dist = event.clientX - lastX;
            let newWidth = Math.max(10, bar.offsetWidth + dist);
            bar.style.width = newWidth + "px";
            lastX = event.clientX;
        }
    }
</script>

// The mousemove handler is registered on the whole window. Even if the mouse
// pointer goes outside the bar, we still want to be able to resize the bar.
// We also have to stop resizing the bar when the mouse button is released. For
// this, we can use the button property from the mousedown event. When this is
// zero, it means that no buttons are currently held down. When buttons are held,
// its value is the sum of the codes for those buttons, the left button has
// code 1, the right button 2, and the middle one 4. That way, you can check if
// a given button is pressed by taking the remainder of the value of the buttons
// and its code.

    // Touch Events

// A touchscreen works differently from a mouse, in that you can't track the
// finger when it isn't on the screen (to simulate "mousemove"), and it allows
// multiple fingers to be on the screen at the same time.

// There are specific event types fired by touch interaction. When a finger
// starts touching the screen, you get a "touchstart" event. When it is moved
// while touching, "touchmove" events fire. Finally, when it stops touching the
// screen, you'll see a "touchend" event.

// Because many touchscreens can detect multiple fingers at the same time, these
// events don't have a single set of coordinates associated with them. Rather,
// their event objects have a touches property, which holds an array-like object
// of points, each with its own clientX, clientY, pageX, and pageY properties.

// Here we show red circles around every touching finger

<style>
    dot { position: absolute; display: block;
        border: 2px solid red; border-radius: 50px;
        height: 100px; width: 100px; }
</style>
<p>Touch this page</p>
<script>
    function update(event) {
        for (let dot; dot = document.queryselector("dot");) {
            dot.remove();
        }
    for (let i = 0; i < event.touches.length; i++) {
        let {pageX, pageY} = event.touches[i];
        let dot = document.createElement("dot");
        dot.style.top = pageY - 50;
        dot.style.left = pageX - 50;
        document.body.appendChild(dot);
    }
}
window.addEventListener("touchstart", update);
window.addEventListener("touchmove", update);
window.addEventListener("touchend", update);
</script>

// It's often best to add a preventDefault in touch event handlers to override
// the browser's default behaviour (which may involve scrolling) and to
// prevent mouse events from being fired.

    // Scroll Events

// Whenever an element is scrolled, a "scroll" event is fired on it. This has
// various uses, such as knowing what the user is currently looking at (for
// disabling off-screen animations) or showing some indication of progress (by
// highlighting part of a table of contents).

// The following draws a progress bar above the document and updates as you scroll

<style>
    #progress {
        border-bottom: 2px solid blue;
        width: 0;
        position: fixed;
        top: 0; left: 0;
    }
</style>
<div id="progress"></div>
<script>
    // Create some content
    document.body.appendChild(document.createTextNode(
        "abcdefabcdef ".repeat(100)));

    let bar = document.querySelector("#progress");
    window.addEventListener("scroll", () => {
        let max = document.body.scrollHeight - innerHeight;
        bar.style.width = `${(pageYOffset / max) * 100}%`;
    });
</script>

// Having a "fixed" position acts like an absolute position but also prevents
// it from scrolling along with the rest of the document. Therefore, "fixed"
// allows the bar to stay at the top. We also use the % instead of px, so the
// bar width grows in proportion to the page width.

// The "innerHeight" gives us the height of the window, which we have to subtract
// the total scrollable height, so you can't keep scrolling when you hit the
// bottom of the document. There's also an innerWidth for the window width. By
// dividing pageYOffset, the current scroll position, by the maximum scroll
// position and multiplying by 100, we get the percentage for the progress bar.
// Calling preventDefault on a scroll event does not prevent scrolling from
// happening. The event handler is called only after scrolling takes place.

    // Focus Events

// When an element gains focus, the browser fires a "focus" event on it. When it
// loses focus, the element gets a "blur" event. Unlike the previous events,
// these two events do not propagate. A handler on a parent element is not
// notified when a child element gains or loses focus. The window object will
// receive "focus" and "blur" events when the user moves from or to the browser
// tab or window in which the document is shown.

<p>Name: <input type="text" data-help="Your full name"></p>
<p>Age: <input type="text" data-help="Your age in years"></p>
<p id="help"></p>

<script>
    let help = document.querySelector("#help");
    let fields = document.querySelectorAll("input");
    for (let fields of Array.from(fields)) {
        field.addEventListener("focus", event => {
            let text = event.target.getAttribute("data-help");
            help.textContent = text;
        });
        field.addEventListener("blur", event => {
            help.textContent = "";
    });
}
</script>

    // Load Event

// When a page finishes loading, the "load" event fires on the window and the
// document body objects. This is needed when scheduling initialization actions
// that require the whole document to have been built. The content of <script>
// tags run immediately when the tag is encountered. This may be too soon, e.g.
// when the script needs to do something with parts of the document that
// appear after the script tag.

// Elements such as images and script tags that load an external file also have
// a "load" event that indicates the files they reference were loaded. Load
// events do not propagate.

// When a page is closed or navigated away from (e.g. following a link), a
// "beforeunload" event fires. This is to prevent the accidental loss of work
// when closing a document. Preventing the page from unloading is not done by
// preventDefault, instead it is done by returning a non-null value from the
// handler. When that happens, the browser shows the user a dialog asking if they
// are sure they want to leave the page.

    // Events and the Event Loop

// Browser event handlers behave like other asyncrhonous notifications. They are
// scheduled when the event occurs but must wait for other scripts to finish
// before they get a chance to run. This means that if the event loop is tied up
// with other work, any interaction with the page (which happens through events)
// will be delayed until there's time to process it. So if you schedule too much
// work, the page will become slow and cumbersome to use.

// For cases where you really want to do some time-consuming thing in the
// background without freezing the page, browsers provide web workers to handle
// those tasks. A worker is a JavaScript process that runs alongside the main
// script, on its own timeline.

// E.g. we can write a worker to square numbers called code/squareworker.js, that
// works in its own thread.

addEventListener("message", event => {
    postMessage(event.data * event.data);
});

// To avoid the problem of multiple threads from touching the same data, workers
// do not share their global scope or any other data with the main script's
// environment. Instead, you have to communicate by sending data back and forth.

// This code spawns a worker running that script, sends it a few messages, and
// outputs the responses

let squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", event => {
    console.log("The worker responded:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);

// The postMessage functions sends a message, which will cause a "message" event
// to fire in the receiver. The script that created the worker sends and receives
// messages through the Worker object, whereas the worker talks to the script
// that created it by sending and listening directly on its global scope. Only
// values that can be represented as JSON can be sent as messages - the other side
// will receive a copy of them, rather than the value itself.

    // Timers

// We saw the use of the setTimeout function in Ch.11, but sometimes we need to
// be able to cancel a function that has been scheduled. To do this, we store the
// value returned by setTimeout and call clearTimeout on it.

let bombTimer = setTimeout(() => {
    console.log("BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% chance
    console.log("Defused.");
    clearTimeout(bombTimer);
}

// The cancelAnimationFrame function works in the same way as clearTimeout
// calling it on a value returned by requestAnimationFrame will cancel that frame
// (assuming it hasn't been called already). A similar set of functions, setInterval
// and clearInterval, are used to set timers that should repeat every X msec.

let ticks = 0;
let clock = setInterval(() => {
    console.log("tick", ticks++);
    if (ticks == 10) {
        clearInterval(clock);
        console.log("stop.");
    }
}, 200);

    // Debouncing

// Some types of events have the potential to fire rapidly, many times in a row
// (e.g. the "mousemove" and "scroll" events). When handling these events, you
// must make sure that your handler does not try to do too many time consuming
// things, or the handler will take up too much time, which will lead to
// interaction with the document feeling slow.

// If you do something nontrivial in such a handler, you can use setTimeout to
// make sure you are not doing it too often. This is called debouncing the event.
// One such approach is to react when a user has typed something, when they are
// typing quickly, we want to wait for a pause, then output "Typed". We also
// want to clear the previous timeout (if any) so that when events occur close
// together, the timeout from the previous event will be canceled.

<textarea>Type something here...</textarea>
<script>
    let textarea = document.querySelector("textarea");
    let timeout;
    textarea.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => console.log("Typed"), 500);
    });
</script>

// Giving an undefined value to clearTimeout or calling it on a timeout that has
// already fire has no effect, so we don't have to be careful about calling it.

// In the next example, we use a different pattern so we space out responses by
// at least a certain length of time, but we want them to fire during events, not
// just afterwards. Here we respond to "mousemove" events by showing the current
// coordinates of the mouse but only every 250 ms.

<script>
    let scheduled = null;
    window.addEventListener("mousemove", event => {
        if (!scheduled) {
            setTimeout(() => {
                document.body.textContent =
                    `Mouse at ${scheduled.pageX}, ${scheduled.pageY}`;
                scheduled = null;
            }, 10000);
        }
        scheduled = event;
    });
</script>
