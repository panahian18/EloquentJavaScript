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

PictureCanvas.prototype.mouse = function (downEvent, onDown) {
    if (downEventEvent.button != 0) return;  // if the left click isn't pressed then return
    let pos = pointerPosition(downEvent, this.dom);  // store the current position of the mouse pointer
    let onMove = onDown(pos);  // call the callback function given to the canvas
    if (!onMove) return; // if the mouse pointer didn't move then return
    let move = moveEvent => {  
        if (moveEvent.buttons == 0) {  // if the mouse button has been released then return
            this.dom.removeEventListener("mousemove", move); 
        } else {
            let newPos = pointerPosition(moveEvent, this.dom);  // find the new position of the mouse
            if (newPos.x == pos.x && newPos.y == pos.y) return; // if the new mouse postion is the same as the old position then return
            pos = newPos; 
            onMove(newPos); // call the callback function with the new position of the mouse
        }
    };
    this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
    let rect = domNode.getBoundingClientRect();
    return {x: Math.floor((pos.clientX - rect.left) / scale),
        y: Math.floor((pos.clientY - rect.top) / scale)};
}

// Since we know the size of the pixels and we can use getBoundingClientRect to
// find the position of the canvas on the screen, it it possible to go from mouse
// event coordinates to picture coordintaes. These are always rounded down to a
// specific pixel.

// Touch events are implemented similarily to mouse events, but using different
// events, and making sure to call preventDefault on the "touchstart" event to
// prevent panning. For touch events, clientX and clientY aren't available directly
// on the event object, but we can use the coordinates of the first touch object
// in the touches property.

PictureCanvas.prototype.touch = function (startEvent,
    onDown) {
    let pos = pointerPosition(startEvent.touches[0], this.dom);
    let onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    let move = moveEvent => {
        let newPos = pointerPosition(moveEvent.touches[0],
            this.dom);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
    };
    let end = () => {
        this.dom.removeEventListener("touchmove", move);
        this.dom.removeEventListener("touchend", end);
    };
    this.dom.addEventListener("touchmove", move);
    this.dom.addEventListener("touchend", end);
};

    
        // The Application

// To make it possible to build the application piece by piece, we'll implement the
// main component as a shell around a picture canvas and a dynamic set of tools and
// controls that we pass to its constructor. 

// The controls are the interface elements that appear below the picture. They'll 
// be provided as an array of component constructors. 

// The tools do things like drawing pixels or filling in an area. The application
// will show the set of available tools as a <select> field. The selected tool
// determines what occurs when the user interacts with the picture with the pointer
// device. The set of tools is an object that maps the list of tools in the drop
// down menu to functions that implement the tools. We pass a picture position,
// the current state, and a dispatch function as arguments to the function. They
// may return a move handler function that gets called with a new position and a 
// current state when the pointer moves to a different pixel.

class PixelEditor {
    constructor(state, config) {
        let { tools, controls, dispatch } = config;
        this.state = state;
        this.canvas = new PictureCanvas(state.picture, pos => {
            let tool = tools[this.state.tool];
            let onMove = tool(pos, this.state, dispatch);
            if (onMove) return pos => onMove(pos, this.state);
        });
        this.controls = controls.map(
            Control => new Control(state, config));
        this.dom = elt("div", {}, this.canvas.dom, elt("br"),
            ...this.controls.reduce((a, c) => a.concat(" ", c.dom), []));
    }
    syncState(state) {
        this.state = state;
        this.canvas.syncState(state.picture);
        for (let ctrl of this.controls) ctrl.syncState(state);
    }
}
    
// The pointer handler given to PictureCanvas calls the currently selected tool with
// the appropriate arguments and, if that returns a move handler, adapts it to also
// receive the state.

// All controls are constructed and stored in this.controls so that they can be 
// updated when the application state changes. The call to reduce introduces spaces
// betwwn the controls' DOM elements. That way they don't look so pressed together.

// The first control is the tool selection menu. It creates a <select> element with 
// an option for each tool and sets up a "change" event handler that updates the
// application state when the user selects a different tool. 

class ToolSelect {
    constructor(state, { tools, dispatch }) {
        this.select = elt("select", {  // create a select element
            onchange: () => dispatch({ tool: this.select.value })  // give it an onChange event handler
        }, ...Object.keys(tools).map(name => elt("option", {  // for each tool in our tool array create an option element for it
            selected: name == state.tool // set the appropriate value for the selected value
        }, name)));
        this.dom = elt("label", null, "🖌 Tool: ", this.select);  // append the label element to the dom 
    }
    syncState(state) { this.select.value = state.tool; }
}

// We wrap the label text and the field in a <label> element so that the label field
// belongs to that field so that clicking that field an focus it.
    
// We also need to be able to change the color, to do so, we use the <input> element
// with a type attribute of color, which gives us a form field that is specialized 
// for selecting colors. Such a field's value is always a CSS colour code in "#RRGGBB"
// format. The browser will then show a colour picker interface. This control creates
// such a field and wires it up to stay synchronized with the application state's colour
// property.

class ColorSelect {
    constructor(state, { dispatch }) {
        this.input = elt("input", {  // create an input element 
            type: "color",
            value: state.color, // give it the value from the state
            onchange: () => dispatch({ color: this.input.value }) // attach an onchange handler
        });
        this.dom = elt("label", null, "🎨 Color: ", this.input);  // wrap it in a label element and attach it to the state's dom property
    }
    syncState(state) { this.input.value = state.color; } // this function allows the state to update its value.
}
    

        // Drawing Tools

// Before we can draw anything, we need to implement the tools that will control 
// the functionality of mouse or touch events on the canvas.

// The most basic tools is the draw tool, which changes any pixel you click or tap
// to the currently selected colour. It dispatches an action that updates the picture
// to a version in which the pointed-at pixel is given the currently selected colour.

function draw(pos, state, dispatch) {
    function drawPixel({ x, y }, state) {
        let drawn = { x, y, color: state.color };
        dispatch({ picture: state.picture.draw([drawn]) });
    }
    drawPixel(pos, state);
    return drawPixel;
}

// The function immediately calls the drawPixel function but then also returns it 
// so that it is called again for newly touched pixels when the user drags or 
// swipes over the picture. 

// We also define a rectangle funciton, which is used to quickly draw rectangles. It
// starts drawing from where you start dragging from to where you release the click. 

function rectangle(start, state, dispatch) {
    function drawRectangle(pos) {
        let xStart = Math.min(start.x, pos.x);
        let yStart = Math.min(start.y, pos.y);
        let xEnd = Math.max(start.x, pos.x);
        let yEnd = Math.max(start.y, pos.y);
        let drawn = [];
        for (let y = yStart; y <= yEnd; y++) {
            for (let x = xStart; x <= xEnd; x++) {
                drawn.push({ x, y, color: state.color });
            }
        }
        dispatch({ picture: state.picture.draw(drawn) });
    }
    drawRectangle(start);
    return drawRectangle;
}

// An important detail in this implementation is that when dragging, the rectangle
// angle is redrawn on the picture from the original state. That way, you can make 
// the rectangle larger and smaller again while creating it, without the 
// intermediate rectangles sticking around in the final picture.

// This is a tool that fills the pixel under the pointer and all adjacent pixels
// that have the same colour. Adjacent meaning horizontally or vertically adjacent
// not diagonally. 

// This code is similar to the pathfinding code in chapter 7, however in this case 
// it seraches for all connected pixels through a grid instead of just a route.

const around = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 },
{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }];

function fill({ x, y }, state, dispatch) {
    let targetColor = state.picture.pixel(x, y);
    let drawn = [{ x, y, color: state.color }];
    for (let done = 0; done < drawn.length; done++) {
        for (let { dx, dy } of around) {
            let x = drawn[done].x + dx, y = drawn[done].y + dy;
            if (x >= 0 && x < state.picture.width &&
                y >= 0 && y < state.picture.height &&
                state.picture.pixel(x, y) == targetColor &&
                !drawn.some(p => p.x == x && p.y == y)) {
                drawn.push({ x, y, color: state.color });
            }
        }
    }
    dispatch({ picture: state.picture.draw(drawn) });
}

// Pick is the final tool, this allows you to point at a colour in the picture and
// use it as the current drawing colour.

function pick(pos, state, dispatch) {
    dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}
                        

        // Saving and loading

        // Undo history

        // Let's Draw

// 

const startState = {
    tool: "draw",
    color: "#000000",
    picture: Picture.empty(60, 30, "#f0f0f0"),
    done: [],
    doneAt: 0
};
const baseTools = { draw, fill, rectangle, pick };
const baseControls = [
    ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];
function startPixelEditor({ state = startState,
    tools = baseTools,
    controls = baseControls }) {
    let app = new PixelEditor(state, {
        tools,
        controls,
        dispatch(action) {
            state = historyUpdateState(state, action);
            app.syncState(state);
        }
    });
    return app.dom;
}
        
// 

// 4:30-8:30 review
// 8:30-9:30 React version
// 9:30-10:30 Finish react version
// 10:30-12:30 ch.5&6 review

// mon

// 10-12 report
// 12-2 finish project & host
// 3-6 ch.7