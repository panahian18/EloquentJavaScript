        // Chapter 19 - Pixel Art Editor

// This application will be a pixel drawing program, where you can modify a picture 
// pixel by pixel by manipulating a zoomed-in view of it, shown as a grid of 
// coloured squares. You can use the program to open image files, scribble on them 
// with your mouse, and save them.  

        // Components

// The interface for our application has a large <canvas> element on top, with 
// several form fields below it. The user draws on the picture by selecting a tool
// from a <select> field and then clicking, touching, or dragging across the canvas.
// There are tools for drawing single pixels or rectangles, for filling an area, and
// for picking a colour from the picture.

// The application consists of the current picture, the selected tool, and the 
// selected colour. We'll set things up so that the state lives in a single value,
// and the interface components always base the way they look on the current state.

// We intentionally choose to have the state live in a single value because in the
// reverse scenario, where all components have their own state, means that all 
// components would have to know about the state of other components. E.g. if we 
// have a colour field, we can just use that to store the colour and read from it 
// when needed, but if we also have a colour picking tool, then the colour field
// would have to know about it and know when it chooses a colour.

// To make our project more modular, we are going to have a one way data flow. There
// is a state, and the interface is drawn based on that state. An interface component
// may respond to user actions by updating the state, at which point the components
// get a change to syncrhonize themselves with this new state.

// Updates to the state are represented as objects, which we'll call actions.
// Components may create such actions and dispatch them, give them to a central
// state management function. The function computes the next state, after which
// the interface components update themselves to this new state.

// The state determines what the DOM looks like, and the only way DOM events can
// change the state is by dispatching actions to the state. The key point is that
// state changes should go through a well-defined channel, and not happen all over
// the place.

// Our components will adhere to an interface. Their constructor is given a state,
// which may be the whole application state or some smaller value if it doesn't need
// access to everything, and it uses that to build up a dom property. This DOM element
// represents the component. Most constructors will also take some other values that
// won't change over time, such as the functio they can use to dispatch an action.

// Each component has a syncState method that is used to synchronize it to a new
// state value. The method takes one argument, the state, which is of the same type
// as the first argument to its constructor.

        // The State

// The application state will be an object with picture, tool, and colour properties.
// THe picture itself is an object that stores the width, height, and pixel content
// of the picture.  The pixels are stored in an array.

class Picture {
    constructor(width, height, pixels) {
        this.width = width;
        this.height = height;
        this.pixels = pixels;
    }
    static empty(width, height, colour) {
        let pixels = new Array(width * height).fill(colour);
        return new Picture(width, height, pixels);
    }
    pixel(x, y) {
        return this.pixels[x + y * this.width];
    }
    draw(pixels) {
        let copy = this.pixels.slice();
        for (let { x, y, colour } of pixels) {
            copy[x + y * this.width] = colour;
        }
        return new Picture(this.width, this.height, copy);
    }
}
    
// |We want to be able to treat a picture as an immutable value. But we sometimes
// need to update a whole bunch of pixels at a time. To be able to do that, the 
// class has a draw method that expects an array of updated pixels, objects with 
// x, y, and colour properties, and creates a new picture with those pixels
// overwritten. This method uses "slice" without arguments to copy an array.

// The empty method uses two new array methods, instantaited a new array with 
// new Array(number), creates an empty array with the length given in the argument.
// The .fill() method fills the array with the given argument.

// Colours are stored as strings in traditional CSS colour, which are hash codes,
// e.g. #ff00ff, which is pink. (red/green/blue).

// We allow the interface to dispatch actions as objects whose properties overwrite
// the properties of the previous state. The colour field, when the user changes it
// could dispatch an object like {colour: field.value}, from which this update
// function can compute a new state. 

function udpateState(state, action) {
    return Object.assign({}, state, action);
}

// This function uses Object.assign to assign to an empty object the properties of
// state and action, which overwrites the same properties in state. However, soon 
// it will be possible to use {...state, ...action} instead.

        // DOM Building

// One of the main roles of components is to create DOM structure, we use a 
// modified form of the elt function to render new elements. 

function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) dom.assign(dom, props);
    for (let child of children) {
        if (typeof child != "string") dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;
}

// This version is the same as the previous one seen in chapter 16, except that it
// assigns properties to DOM nodes, not attributes. This means that we can't set 
// arbitrary attributes, but we can use it to set properties whose value isn't a 
// string like onclick, which we can use an an event handler.

// We can use this new elt function to do stuff like:

/*
<body>
    <script>
        document.body.appendChild(elt("button", {
            onclick: () => console.log("click")
        }, "The Button"));
    </script>
</body>
*/ 

        // The Canvas

// The first component we'll define is the part of the interface that displays the
// picture as a grid of coloured boxes. It has two tasks, display the picture and
// communicate pointer events on that picture to the rest of the application.

// Adhering to our principle of modularity and separation of concerns, the 
// component knows only about the current picture, not the whole application state. 
// Because it doesn't know about the rest of the application, it cannot directly 
// dispatch actions, it instead calls the callback function provided the code that 
// created it, which handles application-specific parts.

// Each pixel is drawn as a 10x10 squares 
const scale = 10;

class PictureCanvas {
    constructor(picture, pointerDown) {
        this.dom = elt("canvas", {
            onmousedown: event => this.mouse(event, pointerDown),
            ontouchstart: event => this.touch(event, pointerDown)
        });
        this.syncState(picture);
    }
    syncState(picture) {
        if (this.picture == picture) return;
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
    }
}

// The syncState() function only redraws when it is given a new picture, to prevent
// unecessary work. 

function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");

    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            cx.fillStyle = picture.pixel(x, y);
            cx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

// When the left mouse button is pressed while the mouse is over the picture canvas,
// the component calls the pionterDown callback, giving it the position of the pixel
// that was clicked, in picture coordinates. The callback may return another
// callback function to be notified when the pointer is moved to a different pixel
// while the button is held down.


        // The Application






        // Drawing Tools

        // Saving and loading

        // Undo history

        // Let's Draw

// 4:30-6:30 review
// 6:30-8:30 React version
// 9:30- 12:30 ch.5&6 review