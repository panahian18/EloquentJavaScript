        // Chapter 16 - Project: A Platform Game

        // The game

// The game will be a platforming game, the objective is to collect the yellow
// boxes (coins), while avoiding the red boxes (lava). The game is over when all
// coins are collected. Players can move left, right, and jump.

        // The technology

// The browser DOM will be used to display the game, and user input will be read
// by handling key events. The levels will be created by creating DOM elements
// and using styling to give them a background colour, size, and position. The
// background is represented by using a table since it is static, and we will
// overlay moving elements by using absolutely positioned elements.

        // Levels

// In order to create human-editable levels, we represent everything as a grid
// as a large string. Where # chars are walls, + charsa are lava, and the player's
// starting position is @, = chars are lava that move horizontally, | are vertically
// moving lava, and ^ is dripping lava. A whole game consists of multiple levels,
// where a level is complete if all coins are collected, if a player touches lava
// the current level is restored to its starting psoition.

        // Reading a level

// The following class stores a level object. Its argument should be the string
// that defines the level.

class Level {
    constructor(plan) { // we take a string that defines the level as an argument
        let rows =  plan.trim().split("\n").map(l => [...l]);  // We trim to remove whitespaces, and split into arrays by newline, and split each rows into arrays of char.
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = []; // Here we store an array of moving characters, called actors

        // Here we separate the actors (moving chars from background chars)
        this.rows = rows.map((row, y) => { // the second argument is the index of the array
            return row.map((ch, x) => {
                let type = levelChars[ch]; // The type of char is determined by the levelChars array
                if (typeof type == "string") return type; // backgrounds are strings
                this.startActors.push(
                    type.create(new Vex(x,y), ch)); // If we encounter an actor, then we create it using the create method, then add it to startActors and return empty for the background
                return "empty";
            });
        });
    }
}

// The position of the actor is stored as a Vec object. This is a 2-D vector, an object with x and y properties

// We also need to use a State class to track the state of the running class
class State {
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
    }

    static start(level) {
        return new State(level, level.startActors, "playing");
    }

    get player() {
        return this.actors.find(a => a.type == "player");
    }
}

// The status property will switch to "lost" or "won" when the game has ended.

        // Actors

// Actor objects represent the current position and state of a given moving
// element in our game. All actor objects conform to the same interface. Their
// pos property holds the coordinates of the element's top-left corner, and their
// size property hold its size.

// They have an update method, which is used to computer their new state and
// position after a given time step. It simulates motion, e.g. player moving.
// A type property contains a string that identifies the type of the actor, e.g.
// "player", "coin", or "lava".

// Actor classes also have a static create method that is used by the Level
// constructor to create an actor from a character in the level plan. It is
// given coords of the character and the character itself.


// The Vec class to handle 2-D values such as position and size of actors
class Vec {
    constructor(x, y) {
        this.x = x; this.y = y;
    }
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }
    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }
}

// The times method cales a vector by a given number. It is useful when we need
// to find distance travelled by multiplying speed by time.

// Here we define the different actor classes

class Player {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
    }

    get type() {return "player";}

    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
    }
}

// Size is the same for players, so we store it on the prototype
Player.prototype.size = new Vec(0,8, 1.5);

// When creating a new Lava actor, we need to initialize the object differently
// depending on the character it is based on. Dynamic lava moves along at its
// current speed until it hits an obstacle. At that point, if it has a reset
// property, it will jump back to its start position (dripping). If it does not,
// it will invert its speed and continue in the other direction (bouncin).

// The create method looks and at the character that the Level constructor passes
// and creates the appropriate lava actor.
class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
    }

    get type() { return "lava"};

    static create(pos, ch) {
        if (ch == "=") {
            return new Lava(pos, new Vec(2, 0));
        } else if (ch == "|") {
            return new Lava(pos, new Vec(0, 2));
        } else if (ch == "v") {
            return new Lva (pos, new Vec(0,3), pos);
        }
    }
}

Lava.prototype.size = new Vec (1, 1);

// Coin actors are simpler, as they mostly sit in place. But they do wobble.
// To track this, a coin object stores a base position, as well as a wobble
// position that tracks the phase of the bouncing motion. Together, these
// determine the coin's actual position.

class Coin {
    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
    }

    get type() { return "coin"}

    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
    }
}

Coin.prototype.size = new Vec(0.6, 0.6);

// We can now define the levelChars object that maps plan characters to either
// background grid types or actor classes.

const levelChars = {
    ".": "empty", "#": "wall", "+": "lava",
    "@": Player, "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
};

// We can now create a Level instance
let simpleLevel = new Level(simpleLevelPlan);

        // Encapsulation as a burden

// Encapsulation is not used much in this example for 2 reasons. First, it takes
// extra effort. It would require additional concepts and interfaces, which would
// be too much code. Second, the various elements in game are so closely tied
// together that if the behaviour of one of them changes, then the other elements
// would also likely change.

// We will, however, encapsulate the drawing subsystem, as it will be used in
// another way in the next chapter.

        // Drawing

// The encapsulation of the drawing code is done by defining a display object,
// which displays a given level and state. The display type we define in this
// chapter is called DOMDisplay because it uses DOM elements to show the level.
// We use style sheets to set the actual colours and fixed properties of the elements.

// The following helper function provides a succint way to create an element and
// give it some attributes and child nodes:
function elt(name, attrs, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}

// A display is created by giving it a parent element to which it should append
// itself and a level object.

class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt("div", {class: "game"}, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }
    clear() { this.dom.remove(); }
}

// The level's background, which never changes, is drawn once. Actors are redrawn
// every time the display is updated with a given state. The actorLayer property
// will be used to track the element that holds the actors so that they can be
// easily removed and replaced.

// Our coordinates and sizes are tracked in grid units, where a size or distance
// of 1 means one grid block. When setting pixel sizes, we will have to scale
// these coordinates up - everything in the game would be ridiculously small at
// a single pixel per square. The scale constant gives the number of pixels that
// a single unit takes up on the screen.

const scale = 20;

function drawGrid(level) {
    return elt("table", {
        class: "background",
        style: `width: ${level.width * scale}px`
    }, ...level.rows.map(row => {
        elt("tr", {style: `height: ${scale}px`},
            ...row.map(type => elt("td", {class: type})))
    ));
}

// The background is drawn as a <table> element. This corresponds nicely to the
// structure of the rows property of the level, each row is turned into a table
// row (<tr> element). The spread operator is used to pass arrays of child nodes
// to elt as separate arguments.

// The following css makes the table look like the background we want.

/*.background { background: rgb(52, 166, 251);
table-layout: fixed;
border-spacing: 0; }
.background td { padding: 0; }
.lava { background: rgb(255, 100, 100); }
.wall { background: white; } */

// We draw each actor by creating a DOM element for it and setting that element's
// position and size based on the actor's properties. The values have to be
// multiplied by scale to go drom game units to pixels.

function drawActors(actors) {
    return elt("div", {}, ...actors.map(actor => {  // create a div element and attach the actors, which have been created, with their associated size and position
        let rect = elt("div", {class: `actor ${actor.type}`});
        rect.style.width = `${actor.size.x * scale}px`;
        rect.style.height = `${actor.size.y * scale}px`;
        rect.style.left = `${actor.pos.x * scale}px`;
        rect.style.top = `${actor.pos.y * scale}px`;
        return rect;
    }));
}

// To give an element more than one class, we separate the class names by spaces.
// E.g. the actor class is used to give them their absolute positions, and their
// type name is used to give them colour.

// .actor { position: absolute;}
// .coin { background: rgb(241, 229, 89);}
// .player { background: rgb(64, 64, 64);}

// The syncState method is used to make the display show a given state. It first
// removes the old actor graphics, if any, then redraws the actors in their new
// positions. We could reuse DOM elements for actors, but it take a lot of extra
// effort in determining which elements go with which actors etc.

DOMDisplay.prototype.syncState = function(state) {
    if (this.actorLayer) this.actorLayer.remove():
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild = drawActors(state.actors);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
};

// By passing the current status to the wrapper, we can style the play actor
// slightly differently when the game is won or lost by adding CSS rules

//.lost .player {
//    background: rgb(160, 64, 64);
//}
//.won .player {
//    box-shadow: -4px -7px 8px white, 4px -7px 8px white;
//}

// When the player hits lava, it will glow red, if it collected all the coins, it
// glow white. The scrollPlayerIntoView function is needed if the level is
// protruding outside the viewport, it scrolls that viewport to make sure the
// player is near its center.

// The following CSS gives the DOM element a max size and ensure that anyting
// sticking out of the element's box is not visible.

/*.game {
    overflow: hidden;
    max-width: 600px;
    max-height: 450px;
    position: relative;
}
*/

// Here we find the player's position and update the wrapping element's scroll
// position. We change the scroll position by manipulating that element's scrollLeft
// and scrollTop properties.
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;
    //...
}


        // Motion and collision



        // Actor updates

        // Tracking keys

        // Running the game
