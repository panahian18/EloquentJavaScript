        // Chapter 17 - Drawing on Canvas

// There are several ways to display graphics on browsers, the first, shown in
// the previous chapters, uses styles to position and colour regular DOM elements.
// However, doing all this means that we are using the DOM to do something it
// wasn't designed to do. And some tasks, like drawing a line between arbitrary
// points is really difficult to do on the dome.

// The 2 alternatives are Scalable Vector Graphics (SVG), and canvas. SVG is a
// document markup dialect that focuses on shapes instead of text. You can embed
// an SVG document directly into an HTML document or include it in an <img> tag.
// A canvas is a single DOM element that encapsulates a picture. It provides a
// programming interface for drawing shapes onto a space taken up by the node.

// The main difference between a canvas and an SVG picture is that in SVG, the
// original descriptions of the shapes is preserved so that they can be moved or
// resized at any time. A canvas will convert the shapes to pixels as soon as
// possible, so it doesn't remember what the pixels represent. To move shapes,
// the canvas must be cleared and redrawn each time.

    // SVG

// The following is an HTML document with a simple SVG picture in it:
<html>
<p>Normal HTML here.</p>
<svg xmls="http://www.w3.org/2000/svg">
    <circle r="50" cx="50" cy="50" fill="red" />
    <rect x="120" y="5" width="90" height="90" stroke="blue" fill="none"/>
</svg>
</html>

// The xmls attribute changes an element (and its children) to a different XML
// namespace. The namespace, identified by a URL, specifies the dialect that is
// being used. The <circle> and <rect> tags do not exist in HTML, but have a
// meaning in SVG, they draw shapes using the style and position specified by
// their attributes. The tags create DOM elements, just like HTML, that scripts
// can interact with, e.g. the following makes the <circle> element cyan.

let circle = document.querySelector("circle");
circle.setAttribute("fill", "cyan");

    // The Canvas Element

// Canvas graphics can be drawn onto a <canvas> element, which you can give
// width and height attributes to determine its size in pixels. A new canvas is
// empty, which means that it shows up as empty space in the document. The canvas
// tag is intended to allow for different styles of drawing. To access an actual
// drawing interface, we need to create a context, an object whose methods provide
// the drawing inteface. Currently, there are 2 contexts, "2d" for 2D graphics,
// and "webgl" for 3D graphics.

// You can create a context with the getContext method on the <canvas> DOM
// element. The following draws a red rectangle 100 pixels by 50 pixels, in the
// top left corner at coordiantes (10, 10), with (0,0) being the top left corner.
<html>
<p>Before canvas.</p>
<canvas width="120" height="60"></canvas>
<p>After canvas.</p>
<script>
    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    context.fillStyle = "red";
    context.fillRect(10, 10, 100, 50);
</script>
</html>

    // Lines and Surfaces

// In the canvas interface, a shape can be filled, meaning its area is given a
// certain color or pattern, or it can be stroked, meaning a line is drawn along
// its edge. The same terminology is used by SVG.

// The fillRect method fills a rectangle, it takes as its parameters, the x- and
// y- coordinates of the rectangle's top-left corner, then its width, and then
// its height. A similar method, strokeRect, draws the outline of a rectangle.

// The styling of fill or stroke are not provided as arguments to those functions,
// but as properties of their context objects. The fillStyle property controls
// the way shapes are filled. It is set using a string that uses CSS colour
// notation. The strokeStyle property works similarily, but determines the colour
// for the stroked line. The width of that line is determined by lineWidth.

<html>
<canvas></canvas> // When no width or height attribute is specified, the elements get a default 300px width, and 150px height.
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.strokeStyle = "blue";
    cx.strokeRect(5, 5, 50, 50);
    cx.lineWidth = "5";
    cx.strokeRect(135, 5, 50, 50);
</script>
</html>

    // Paths

// A path is a sequence of lines. The 2D canvas interface takes a peculiar
// approach to describing such a path. It is done entirely through side effects.
// Paths are not values that can be stored and passed around. Instead, they are
// created by a series of method calls.

// The following creates a series of horizontal line segments and then strokes
// it using the stroke method. Each segment created with lineTo starts at the
// current position. That position is usually the end of the last segment, unless
// moveTo was called.

<html>
<canvas></canvas>
    <script>
        let cx = document.querySelector("canvas").getContext("2d");
        cx.beginPath();
        for (let y = 10; y < 100; y += 10) {
            cx.moveTo(10, y);
            cx.lineTo(90, y);
        }
        cx.stroke();
    </script>
</html>

// When filling a path (using a fill method), each shape is filled separately.
// A path can contain multiple shapes, each moveTo motion starts a new one. But
// paths need to be closed (its start and end are in the same position) before it
// can be filled. If the path is not already closed, a line is added from its
// end to its start.

// This example draws a filled triangle. Only 2 of its sides are drawn to
// demonstrate the effect that a path is automatically closed. You could also
// use the closePath method to explicitly close a path by adding an actual line
// segment back to the path's start. This segment is drawn when stroking the path.

<html>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(50, 10);
    cx.lineTo(10, 70);
    cx.lineTo(90, 70);
    cx.fill();
</script>
</html>

    // Curves

// A path may also contain curved lines. There are several methods used to draw
// curves. The first method, quadraticCurveTo method, which draws a curve to a
// given point. The method is given a control point as well as a destination
// point. The control point is the factor that curves the line, although the
// curve doesn't go through it, you can draw a straight line through the start
// and control point and destination and control points.

<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(10, 90);
    cx.quadraticCurveTo(60, 10, 90, 90); // control=(60, 10) goal=(90, 90)
    cx.lineTo(60, 10);
    cx.closePath();
    cx.stroke();
</script>
</html>

// Another method used to draw curves is bezierCurveTo(), which takes 2 control
// points instead of 1, one for each of the line's endpoints. The two control
// points specify the direction at both ends of the curve. The further away they
// are from their corresponding point, the more the curve will bulge that way.

<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(10, 90);
    cx.bezierCurveTo(10, 10, 90, 10, 50, 90); // control1: 10, 10  control2: 90, 10
    cx.lineTo(10, 90);
    cx.lineTo(10, 10);
    cx.closePath();
    cx.stroke();
</script>
</html>

// The third method, arc(), is used to draw a line that curves along the edge of
// a circle. It takes a pair of coordinates for the arc's center, a radius, and
// then a start and end angle. The angles passed are angles of a circle, a full
// circle is 2pi, or about 6.28. You can use a number larger than 2pi, like 7, to
// ensure a full circle.

// This example draws a full circle, and a quarter circle. The resulting picture
// contains a line from the right of the full circle to the right of the quarter
// circle, a line drawn with arc is connected to the previous path segment, you
// can use moveTo to avoid this.

<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.arc(50, 50, 50, 0, 7); // center = (50, 50) radius = 40, angle = 0 to 7
    cx.arc(150, 50, 40, 0, 0.5 * Math.PI);
    cx.stroke();
</script>
</html>

    // Drawing a Pie Chart

// Suppose we wanted to draw a Pie chart based on a customer satisfaction survey.
// The result binding contains an array of objects that represent the survey
// responses.

const results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];

// To draw a pie chart, we draw a number of pie slices, each made up of an arc
// and a pair of lines to the center of that arc. We can compute the angle taken
// up by each arc by dividing a full circle (2pi) by the total number of responses
// and then multiplying that number (the angle per response) by the number of
// people who picked a given choice.

<html>
<canvas width="200" height="200"></canvas>
<script>
    let cx = document.querySelector("canvas");
    let total = result.reduce((sum, {count}) => sum + count, 0);
    // Start at the top
    let currentAngle = -0.5 * Math.PI;
    for (let result of results) {
        let sliceAngle = (result.count / total) * Math.PI * 2;
        cx.beginPath();
        cx.arc(100, 100, 100, currentAngle, sliceAngle);
        cx.lineTo(100, 100);
        cx.fillStyle = result.color;
        cx.fill();
    }
</script>
</html>

// The next section will allow us to draw text to the canvas to add labels to
// the chart.

    // Text

// The 2D canvas drawing context also provides the fillText and strokeText methods.
// The latter is used to outline texts, while fillText will fill the outline of
// a given text with the current fillStyle. You can specify size, style, and font
// of the text with the font property.

// The last 2 arguments to fillText and strokeText provide the position at which
// the font is drawn. The last two arguments to fillText and strokeText provide
// the position of the start of the text's alphabetic baseline, which is the line
// that the letters "stand" on, not counting the hanging parts. You can change
// the horizontal position by setting the textAlign property to "end", or "center"
// and the vertical position by setting textBaseline to "top", "middle", or "bottom".

<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.font = "28px Georgia";
    cx.fillStyle = "fuchsia"
    cx.fillText("I can draw text, too!", 10, 50);
</script>
</html>

    // Images

// There are two types of computer graphics, vector graphics and bitmap graphics.
// The first is what we have been doing so far in this chapter, specifying a
// picture by giving a logical description of shapes. Bitmap graphics don't
// specify actual shapes but rather work with pixel data (rasters of coloured dots).

// The drawImage method allows us to draw pixel data onto a canvas. This pixel
// data can originate from an <img> element or from another canvas. The following
// example creates a detached <img> element and loads an image file into it. But
// it cannot immediately start drawing from this picture because the browser may
// not have loaded it yet. To deal with this, we register a "load" event handler
// to do the drawing after the image has loaded.

<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    let img = document.createElement("img");
    img.src = "img/hat.png";
    img.addEventListener("load", () => {
        for (let x = 10; x < 200; x += 30) {
            cx.drawImage(img, x, 10);
        }
    });
</script>
</html>

// By default, drawImage will draw the image at its original size, you can also
// give it two additional arguments to set a different width and height. However,
// if given 9 arguments, drawImage can be used to draw only a fragment of an
// image. The second through fifth arguments indicate the rectangle (x, y, width,
// and height) in the source that should be copied, and the sixth to ninth arguments
// give the rectangle (on the canvas) into which it should be copied.

// This can be used to pack multiple sprites into a single image file and then
// draw only the part you need. For example, a single image of a character in
// multiple poses can be used to create an animation. We can use the clearRect
// method, which makes a rectangle transparent, removing the previously drawn pixels.

// Since each sprite is 24px X 30px, we can create an animation with the following:
<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    let img = document.createElement("img");
    img.src = "img/player.png";
    let spriteW = 24, spriteH = 30;
    img.addEventListener("load", () => {
        let cycle = 0;
        setInterval(() => {
            cx.clearRect(0, 0, spriteW, spriteH);
            cx.drawRect(img, cycle * spriteW, 0, spriteW, spriteH, 0, 0, spriteW, spriteH);
            cycle = (cycle + 1) % 8;
        }, 120);
    });
</script>
</html>

    // Transformation

// But what if we want our character to walk to the left instead of to the right?
// We could draw another set of sprites, but we can also instruct the canvas to
// draw the picture the other way round. Calling the scale method will cause
// anything drawn after it to be scaled. This method takes 2 parameters, one to
// set a horizontal scale and one to set a vertical scale.

<html>
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.scale(3, .5);
    cx.beginPath();
    cx.arc(50, 50, 40, 0, 7);
    cx.lineWidth = 3;
    cx.stroke();
</script>
</html>

// Because of the call to scale, the circle is drawn 3 times as wide and half as
// high. Scaling will cause everything about the drawn image, including the line
// width to be stretched out or squeezed together as specified. Scaling it by a
// negative number will flip the direction of the coordinate system. The flipping
// happens around point (0, 0), so when a horizontal scaling of -1 is applied, a
// shape drawn at x position 100 will end up at what used to be position -100.

// So to turn a picture around, we can't simply add cx.scale(-1, 1) before the
// drawImage because that would move the picture outside of the canvas, where it
// won't be visible. You could adjust the coordinates given to drawImage to
// compensate for this by drawing the image at x position -50 instead of 0.
// Another solution is to adjust the axis around which the scaling happens.

// You can use the rotate() method on subsequently drawn shapes and move them with
// the translate method. These transformations stack, meaning that each one happens
// relative to the previous transformations. So if we first move the center of
// the coordinate system to (50, 50), then rotate by 20 degrees, that rotation
// will happen around point (50, 50). Therefore, the order of transformations matters.

// To flip a picture around the vertical line at a given x position, we can do:
function flipHorizontally(context, around) {
    context.translate(around, 0); // First translate to the right
    context.scale(-1, 1);  // Flip around the vertical axis around the original x position
    context.translate(-around, 0); // Move back tot he right to fix the position
}

// We can now draw a mirrored character at position (100, 0) by flipping around
// the character's veritcal center.

<html>
<canvas></canvas>
<script>
 let cx = document.querySelector("canvas").getContext("2d");
 let img = document.createElement("img");
 img.src = "img/player.png";
 let spriteW = 24, spriteH = 30;
 img.addEventListener("load", () => {
     flipHorizontally(cx, 100 + spriteW / 2);
     cx.drawImage(img, 0, 0, spriteW, spriteH, 100, 0, spriteW, spriteH);
 });
</script>
</html>

    // Storing and clearing Transformation

// Transformations stick around, everything we draw after drawing mirrored chars
// will also be mirrored, which may not be wanted. It is possible to save the
// current transformation, do some drawing and transforming, and then restore the
// old transformation. The save and restore methods on the 2D canvas context do
// this transformation management. They conceptually keep a stack of transformation
// states, when you call save, the current state is pushed onto the stack, and when
// you call restore, the state on top of the stack is taken off and used as the
// context's current transformation. You can also call resetTransformation() to
// fully reset the transformation.

// This function draws a treelike shape by drawing a line, moving the coordinate
// system down the end of the line, and calling it twice, first rotated to the
// left then to the right. Every call reduces the length of the branch drawn, if
// the length of the branch reduces to below 8, then the recursion stops. If the
// calls to save and restore weren't there, the second recursive call to branch
// would end up with the position and rotation created by the first call. It
// wouldn't be connected to the current branch but rather to the innermost,
// rightmost branch drawn by the first call.

<html>
<canvas width="600" height="300"></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    function branch(length, angle, scale) {
        cx.fillRect(0, 0, 1, length); // Draw the line
        if (length < 8) return; // Base condition for recursion
        cx.save(); // Save the current state of the context
        cx.translate(0, length); // Move the context to the end of the line
        cx.rotate(-angle); // Change direction
        branch(length * scale, angle, scale); // first recursive call
        cx.rotate(2 * angle); // switch direction
        branch(length * scale, angle, scale);
        cx.restore(); // Allows previous function call to have previous context state.
    }
    cx.translate(300, 0);
    branch(60, 0.5, 0.8);
</script>
</html>

    // Back to the game

// We now will rebuild the game from the previous chapter using a canvas-based
// system. Instead of coloured boxes we will use drawImage to draw pictures that
// represent the game's elements. We also define a display object type called
// CanvasDisplay, supporting the same interface as DOMDisplay, including syncState
// and clear.

// This object keeps a little more information than DOMDisplay, instead of the
// scroll position of its DOM element, it tracks its own viewport, which tells us
// what part of the level we are looking at. It also keeps a flipPlayer property
// to keep track of the direction the player faces.

class CanvasDisplay{
    constructor(parent, level) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = Math.min(600, level.width * scale);
        this.canvas.height = Math.min(450, level.height * scale);
        parent.appendChild(this.canvas);
        this.cx = this.canvas.getContext("2d");

        this.flipPlayer = false;

        this.viewPort = {
            left: 0,
            top: 0,
            width: this.canvas.width / scale,
            height: this.canvas.height / scale
        };
    }

    clear() {
        this.canvas.remove();
    }
}

// The syncState method first computes a new viewport and then draws the game
// scene at the appropriate position.

CanvasDisplay.prototype.syncState = function(state) {
    this.updateViewport(state);
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
}

// Contrary to DOMDisplay, this display does have to redraw the background on
// every update. Because shapes on a canvas are just pixels, after we draw them
// there is no good way to move them (or remove them). The only way to update the
// canvas display is to clear it and redraw the scene.

// The updateViewport method is similar to the DOMDisplay's scrollPlayerIntoView
// method. It checks whether the player is too close to the edge of the screen
// and moves the viewport when this is the case.

CanvasDisplay.prototype.updateViewport = function(state) {
    let view = this.viewport, margin = view.width / 3;
    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5));

    if (center.x < view.left + margin) {
        view.left = Math.max(center.x - margin, 0);
    } else if (center.x > view.left + view.width - margin) {
        view.left = Math.min(center.x + margin - view.width,
                             state.level.width - view.width);
    }
    if (center.y < view.top + margin) {
        view.top = Math.max(center.y - margin, 0);
    } else if (center.y > view.top + view.height - margin) {
        view.top = Math.min(center.y + margin - view.height,
                            state.level.height - view.height);
    }
};

// When clearing the display, a different colour will be used depending on if the
// game is won or lost.

CanvasDisplay.prototype.clearDisplay = function(status) {
    if (status == "won") {
        this.cx.fillStyle = "rgb(68, 191, 255)";
    } else if (status == "lost") {
        this.cx.fillStyle == "rgb(44, 136, 214)";
    } else {
        this.cx.fillStyle = "rgb(52, 166, 251)";
    }
    this.cx.fillStyle(0, 0,
                        this.canvas.width, this.canvas.height);
};

// To draw the background, we run through the tiles that are visible in the
// current viewport, using the same trick in the touches method from the
// previous chapter.

let otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.img";

CanvasDisplay.prototype.drawBackground = function(level) {
    let {left, top, width, height} = this.viewport;
    let xStart = Math.floor(left);
    let xEnd = Math.ceil(left + width);
    let yStart = Math.floor(top);
    let yEnd = Math.ceil(top + height);

    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            let tile = level.rows[y][x];
            if (tile == "empty") continue;
            let screenX = (x - left) * scale;
            let screenY = (y - top) * scale;
            let tileX = tile == "lava" ? scale : 0;
            this.cx.drawImage(otherSprites,
                              tileX,    0, scale, scale,
                              screenX, screenY, scale, scale);
        }
    }
};

// We don't bother waiting for the sprite image to load, since not loading will
// just leave a blank space, which is fine since it will fill in as the screen
// will continuously update.

// The walking character shown earlier will be used to represent the player. The
// first eight sprites contain a walking animation. We switch frames every 60
// milliseconds, so the time is divided by 60 first. When the player is standing
// still, we draw the ninth sprite. During jumps, which are recognized by the
// fact that the vertical speed is not zero, we use the tenth, rightmost sprite.

// Because the sprites are slightly wider than the player object, 24 instead of
// 16 pixels to allow some space for feet and arms, the method has to adjust the
// x-coordinate and width by a given amount (playerXOverlap).

let playerSprite = document.createElement("img");
playerSprites.src = "img/player.png";
const playerXOverlap = 4;

CanvasDisplay.prototype.drawPlayer = function(player, x, y, widht, height) {

    width += playerXOverlap * 2;
    x -= playerXOverlap;
    if (player.speed.x != 0) {
        this.flipPlayer = player.speed.x < 0;
    }

    let tile = 8;
    if (player.speed != 0) {
        tile = 9;
    } else if (player.speed.x != 0) {
        tile = Math.floor(Date.now() / 60) % 8;
    }

    this.cx.save();
    if (this.flipPlayer) {
        flipHorizontally(this.cx, x + width / 2);
    }
    let tileX = tile * width;
    this.cx.drawImage(playerSprites, tileX, 0, width, height,
                                    x,      y, width, height);
    this.cx.restore();
};

// The drawPlayer method is called by drawActors, which is responsible for
// drawing all the actors in the game.

CanvasDisplay.prototype.drawActors = function(actors) {
    for (let actor of actors) {
        let width = actor.size.x * scale;
        let height = actor.size.y * scale;
        let x = (actor.pos.x - this.viewport.left) * scale;
        let y = (actor.pox.y - this.viewport.top) * scale;
        if (actor.type == "player") {
            this.drawPlayer(actor, x, y, width, height);
        } else {
            let tileX = (actor.type == "coin" ? 2 : 1) * scale;
            this.cx.drawImage(otherSprites,
                              tileX, 0, width, height,
                              x,     y, width, height);
        }
    }
};

// When drawing something that is not the player, we look at its type to find the
// offset of the correct sprite. The lava tile is found at offset 20, and the coin
// at offset 40 (two times "scale"). We have to subtract the viewport's position
// when computing the actor's position since (0,0) on our canvas corresponds to
// the top left of the viewport, not the top left of the level. We could also
// have used translate or this, either way works.

    // Choosing a graphics interface

// When you need to generate graphics in the browser, you can choose between
// plain HTML, SVG, and canvas. There is no single best option that works in all
// situations, each have their strengths and weaknesses.

// Plain html is simple and integrates well with text. While both SVG and canvas
// allows you to draw text, they won't help you position that text or wrap it
// when it takes more than one line. In html, it is much easier to include blocks
// of text.

// SVG can be used to produce crisp graphics that look good at any zoom level.
// unlike html, it is designed for drawing and is thus more suitable for that.

// SVG and html build up a data structure (the DOM) that represents your picture,
// this allows it to modify elements after they are drawn. If you need to make
// repeated changes on a small part of a big picture in response to what the user
// is doing or as an animation then doing it in canvas can be unnecessarily
// diffcult.

// But canvas is useful when drawing a huge number of tiny elements, as it does
// not build a data structure but only repeatedly draws onto the same pixel
// surface, which gives canvas a low cost per shape. Canvas is also suitable for
// certain effects like rendering a scene one pixel at a time, or postprocessing
// e.g. blurring or distorting it.

// In some cases you might want to combine several of these techniques, e.g. using
// SVG or canvas to draw a graph but show textual information by positioning an
// HTML element on top of the picture.

    // Summary

// Drawing a rectangle on canvas
<canvas width="120" height="60"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.fillStyle = "red";
  cx.fillRect(0, 0, 100, 50);
</script>

// Drawing lines and surfaces
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.strokeStyle = "blue";
    cx.strokeRect(5, 5, 50, 50);
    cx.lineWidth = 5;
    cx.strokeRect(135, 5, 50, 50);
</script>

// Paths
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();     // A path can contain multiple shapes
    cx.moveTo(50, 10);  // Each moveTo creates a new shape
    cx.lineTo(10, 90);
    cx.lineTo(90, 70);
    cx.fill();          // Note: a path needs to be closed to be filled but a path
</script>               // may a line may be drawn automatically if it is not.

// Curves

// quadraticCurveTo()
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(10, 90);
    // control=(60, 10) goal=(90, 90)
    cx.quadraticCurveTo(60, 10, 90, 90);  // Uses a control point that "pulls" line towards it
    cx.lineTo(60, 10);
    cx.closePath(); // Here we explicitly close the path since we are using stroke()
    cx.stroke();
</script>

// bezierCurveTo()
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(10, 90);
    cx.bezierCurveTo(10, 10, 90, 10, 50, 90); // control1: 10, 10 control2: 90, 10
    cx.lineTo(10, 90);
    cx.lineTo(10, 10);
    cx.closePath();
    cx.stroke();
</script>

// arc()
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.arc(50, 50, 40, 0, 7); // center = (50, 50) radius = 40, angle = 0 to 7
    cx.arc(150, 50, 40, 0, 0,5 * Math.PI); // unless moveTo is used, a line will be drawn between arcs
    cx.stroke();
</script>


// Drawing a Pie Chart
<canvas width="200" height="200"></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    let total = results.reduce((sum, {count}) => sum + count, 0);
    // Start at the top
    let currentAngle = -0.5 * Math.PI;
    for (let result of results) {
        let sliceAngle = (result.count / total) * 2 * Math.PI;
        cx.beginPath();
        cx.arc(100, 100, 100, currentAngle, currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        cx.lineTo(100, 100);
        cx.fillStyle = result.color;
        cx.fill();
    }
</script>

// Text

// fillText() & strokeText()
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.font = "28px Georgia";
    cx.fillStyle = "fuchsia";
    cx.fillText("I can draw text, too!", 10, 50); // 10, 50 is the position at which the text is printed
</script>

// Images

// drawImage()
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    let img = document.createElement("img");
    img.src = "img/hat.png";
    img.addEventListener("load", () => {
        for (let x = 0; x < 200; x++) {
            cx.drawImage(img, x, 10); // you can also give it two additional args to
        }                             // give it a different height and width
    });
</script>

// drawImage() with 9 arguments
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    let img = document.createElement("img");
    img.src = "img/player.png";
    img.addEventListener("load", () => {
        let cycle = 0;
        setInterval(() => {
            cx.clearRect(0, 0, spriteW, spriteH);
            cx.drawImage(img, cycle * spritew, 0, spriteW, spriteH, 0, 0, spriteW, spriteH);
            cycle = (cycle + 1) % 8;
        }, 120);
    });
</script>

// Transformation

// scale()
<canvas></canvas>
<script>
    let cx = document.querySelector("canvas").getContext("2d");
    cx.scale(3, .5);
    cx.beginPath();
    cx.arc(50, 50, 40, 0, 7);
    cx.lineWidth = 3;
    cx.stroke();
</script>

// flipping with translate()
<canvas></canvas>
<script>
function flipHorizontally(context, around) {
    context.translate(around, 0); // first shift canvas
    context.scale(-1, 1); // flip
    context.translate(-around, 0); // bring it back to its original spot
}
</script>

// Storing and Clearing Transformations

// Recursively draw a tree using save() and restore()
<canvas></canvas>
<script>
let cx = document.querySelector("canvas").getContext("2d");
function branch(length, angle, scale) {
    cx.fillRect(0, 0, 1, length); // Draw the line
    if (length < 8) return; // Base condition for recursion
    cx.save(); // Save the current state of the context
    cx.translate(0, length); // Move the context to the end of the line
    cx.rotate(-angle); // Change direction
    branch(length * scale, angle, scale); // first recursive call
    cx.rotate(2 * angle); // switch direction
    branch(length * scale, angle, scale);
    cx.restore(); // Allows previous function call to have previous context state.
}
cx.translate(300, 0);
branch(60, 0.5, 0.8);
</script>
