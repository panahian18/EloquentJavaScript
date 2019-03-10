    // Chapter 14 - The Document Object Model

// Opening a web page in a browser causes the browser to retrieve the HTML text
// and parses it. The browser builds up a model of the document's structure and
// uses this model to draw the page on the screen. The representation of this
// document as a data structure means that it can be read and modified.

    // Document Structure

// An HTML document should be viewed as a set of nested boxes. Tags such as
// <body> and </body> enclose other tags.

<!doctype html>
<html>
<head>
  <title>My home page</title>
</head>
<body>
  <h1>My home page</h1>
  <p>Hello, I am Marijn and this is my home page.</p>
  <p>I also wrote a book! Read it
    <a href="http://eloquentjavascript.net">here</a>.</p>
</body>
</html>

// For each box, there is an object, which we can interact with, to find out
// things like what HTML tag it represents and which boxes and text it contains.
// This is called the document object model (DOM).

// The global binding "document" gives us access to these objects. Its
// "documentElement" property refers to the object representing the <html> tag.
// Since every HTML document has a head and a body, it also has head and body
// properties, pointing at those elements.

    // Trees

// The shape of the structure representing the document is of a tree where nodes
// may refer to other nodes, children, which in turn may have their own children.
// This data structure is a tree since it has a branching structure, has no
// cycles, and has a single, well defined root, in the case of the DOM,
// document.documentElement serves as the root.

// The DOM has different types of nodes for different types of elements (the
// things represented by HTML tags) these determine the structure of the
// document. These can in turn have child nodes. E.g. document.body is a node,
// which can have its own child nodes, some of these can be leaf nodes, such as
// comments or text.

// Each DOM node object has a nodeType property, which contains a code (number)
// that identifies the type of node. Elements have code 1, which is also defined
// by the constant property "Node.ELEMENT_NODE", text has code 3
// (Node.TEXT_NODE) and comments have code 8 (Node.COMMENT_NODE).

    // The Standard

// HTML is designed to be language independent, as a result HTML doesn't have
// many of the language specific abstractions that make its use easy, leading to
// frequent boilerplate code. However, libraries exist to fill in the gap.

// E.g. the childNodes property that element nodes in the DOM have is
// not an array but an instance of NodeList type, which means that you cannot
// slice and map. Also, you cannot create a new node and immediately add children
// to it, you have to individually create children and add them one by one.

    // Moving through the Tree

// DOM nodes have a wealth of links to other nearby nodes, e.g. every element
// node has a parentNode property that points to the node it is part of, if any.
// Also, they have a childNodes property that points to an array-like object
// holding its children.

// In addition, element nodes have the properties: firstChild, lastChild,
// previousSibling, and nextSibling, if a property does not apply to an ele.
// node then it is simply left as null. There is also the "children" property
// that contains only element children, no other types of child nodes, e.g. text

// When dealing with nested data structures, recursive functions are often useful
// This scans a document for text nodes that contain a given string and returns true
function talksAbout(node, string) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (talksAbout(node.childNodes[i], string)) {
        return true;
      }
    }
    return false;
  } else if (node.nodeType == Node.TEXT_NODE) {
    return node.nodeValue.indexOf(string) > -1;
  }
}
// The nodeValue property of a text node holds the string of text that is represents.

    // Finding Elements

// Using these links between nodes to navigate is often useful, but if we want
// to find a specific node by starting at document.body and following a fixed
// path is often a bad idea since it bakes assumptions about the precise structure
// of our structure into our program, when this structure may change in the future.

// Additionally, text nodes are created when there are whitespaces between nodes,
// the above example actually has 7 child nodes instead of 3. So, if we want to
// get the first link in the document, instead of giving a path, we just ask for
// the first link in the document.

let link = document.body.getElementsByTagName("a")[0];
console.log(link.href);

// All element nodes have a getElementsByTagName method, which collects all
// elements with the given tag name that are descendants of that node and
// returns them as an array-like object. To find a specific single node, you can
// give it an id attribute and use document.getElementById instead.

<p>My ostrich Gertrude:</p>
<p><img id="gertrude" src="img/ostrich.png"></p>
+
<script>
  let ostrich = document.getElementById("gertrude");
  console.log(ostrich.src);
</script>

// Similarily, you can use getElementByClassName, which is similar to the above
// but retrieves all elements that have the given string in their class attribute.
let ostrich = document.getElementsByClassName("ostrich");

    // Changing the document

// The DOM data structure can be modified extensively. We can use "remove" to
// remove a node, and we can add a child node to an element node by using
// "appendChild" to add a node at the end of a list of children or "insertBefore"
// which inserts the first argument before the second argument node.

<p>One</p>
<p>Two</p>
<p>Three</p>

<script>
  let paragraphs = document.body.getElementsByTagName("p");
  document.body.insertBefore(paragraphs[2], paragraphs[0]);
</script>

// All operations that involve inserting a node will as a side effect remove it
// from its current position first. The replaceChild method is used to replace
// a child node with another one. It accepts a new node as the first arg and the
// node to be replaced as the second one.

    // Creating nodes

// Here we want to replace all images in the document with the text held in their
// alt attributes. Text nodes are created with document.createTextNode

<p>The <img src="img/cat.png" alt="Cat"> in the
  <img src="img/hat.png" alt="Hat">.</p>

<p><button onclick="replaceImages()">Replace</p>

<script>
  function replaceImages() {
    let images = document.getElementsByTagName("img");
    for (let i = images.length - 1; i >= 0; i--) {
      let image = images[i];
      if (image) {
        let text = document.createTextNode(image.alt);
        image.parentNode.replaceChild(text, image);
      }
    }
  }
</script>

// It is important that we start at the end of the list of images since the list
// returned by getElementsByTagName is a live list, meaning that it is updated
// as the document changes. If we started at the beginning then removing the
// first image would cause the list to lose its first element so that the second
// time the loop repeats, where i is 1, it would stop since the length of the
// collection is now 1.

// In order to create a solid collection of nodes, instead of a live one, we
// can use Array.from

let arrayish = {0: "on", 1: "two", length: 2};
let array = Array.from(arrayish);
console.log(array.map(s => s.toUpperCase()));
// -> [ONE, TWO]

// To create element nodes, you can use the document.createElement method, this
// method takes a tag name and returns a new empty node of a given type.

// The following utility elt, creates an element node, with the type as the
// first argument, and the following arguments are children of the first node.

<blockquote id="quote">
No book can ever be finished. While working on it we learn
just enough to find it immature the moment we turn away
from it
</blockquote>

<script>
  function elt(type, ...children) {
    let node = document.createElement(type);
    for (let child of children) {
      if (typeof(child) != "string") node.appendChild(child); // If the node is already of type string then just return it
      else node.appendChild(document.createTextNode(child)); // If the type of the node is not of string then create a new text node
    }
    return node;
  }

  document.getElementById("quote").appendChild(
    elt("footer", "-", elt("strong", "Karl Popper"),
      ", preface to the second edition of ",
        elt("em", "The Open Society and Its Enemies"), ", 1950"));
</script>

    // Attributes

// Some element attributes, like href, can be accessed through a property of the
// same name on the element's DOM object. HTML lets you set up whatever element
// property you want but this doesn't mean you can access it as a property of the
// element node. Instead, you have to use setAttribute and getAttribute.

<p data-classified="secret">The launch code is 00000000.</p>
<p data-classified="unclassified">I have two feet.</p>

<script>
  let paras = document.getElementsByTagName("p");
  for (let para of Array.from(paras)) {
      if (para.getAttribute("data-classified") == "secret") {
        para.remove();
      }
  }
</script>

// It is recommended that made-up attributes start with "data-" so they don't
// conflict with other attributes. Elements also have the attribute "class", but
// historically JS couldn't handle attributes with the same name as keywords, so
// it is accessed by className, but you can also use set and get with "class".

    // Layout

// There are 2 types of elements, block elements like <p> or heading <h1>, these
// take up an entire line, while inline elements, like <a> are rendered on the
// same line with their surrounding text.

// For each document, browsers compute a layout, which gives each element a size
// and position based on its type and content. The layout is then used to
// actually draw the document. Size is given by the properties offsetWidth and
// offsetHeight. clientWidth and clientHeight give you the size of the space
// ignoring the border width.

<p style="border: 3px solid red">"I'm boxed in"</p>

<script>
  let para = document.getElementsByTagName("p")[0];
  console.log("clientHeight:", para.clientHeight);
  console.log("offsetHeight:", para.offsetHeight);
</script>

// To find the precise position of an element on the screen, use the
// getBoundingClientRect method, which returns a object with the top, bottom,
// left, and right properties, relative to the top left corner of the screen. If
// you want them relative, then add the current scroll position which can be
// found by pageXOffset and pageYOffset.

// Everytime a program changes the document, the browser has to redraw the
// layout, but this causes a lot of work. When a program asks for a position or
// size, it also causes the browser to compute the layout.

    // Styling

// Different HTML elements are drawn differently, some as blocks, some as inline,
// some bold (<strong>), etc. But we can modify the default HTML styling.
// A style attribute may contain one or more declarations, which are a property
// followed by a colon and a value, e.g. "color: red; border: none"

<p><a href=".">Normal link</a></p>
<p><a href="." style="color: green">Green link</a></p>

// The display property controls whether an element is displayed as a block
// or an inline element. The "display: none" prevents an element from showing
// up on the screen. It is often preferable to removing since we can it add again.

This text is displayed <strong>inline</strong>
<strong style="display: block">as a block</strong>, and
<strong style="display: none">not at all</strong>

// JS can directly manipulate an element's style using the element's style
// property. This property holds an object that has properties for all possible
// style properties. The values of these properties are strings. Attribute names
// that have hypens in HTML (e.g. font-family) are camel case in JS (fontFamily).

<p id="para" style="color: purple">
  Nice text
</p>

<script>
  let para = document.getElementById("para");
  console.log(para.style.color);
  para.style.color = "magenta";
</script>

    // Cascading Styles

// Cascading Style Sheets (CSS) is the styling system for HTML, it is a set of
// rules for how to style elements in a document. It is called cascading since
// multiple rules are allowed to be combined. When multiple rules define a value
// for the same property, the most recent one applies, also styles in a "styles"
// attribute applied directly to the node have the highest precedence.

<style>
  strong {
    font-style: italic;
    color: gray;
  }
</style>
<p>Now <strong>strong text</strong> is italic and gray.</p>

// It is possible to target things other than tag names in CSS rules. A rule for
// .abc applies to all elements with the class name abc, and #abc applies to all
// elements with the id abc.

.subtle {
  color: gray;
  font-size: 80%;
}
#header {
  background: blue;
  color: white;
}

// p elements with classes a and b, and id main
p.a.b#main {
//  margin-bottom: 20px;
}

// The precedence rules for most recently applied rule only applies if the rules
// have the same specificity. The notation p > a ...{} applies the given styles
// to all <a> tags that are direct children of <p> tags. p a ...{} applies to
// all <a> tags inside <p> tags, whether they are direct or indirect.

    // Query Selectors

// The querySelectorAll method, which is defined in both the document object and
// the element nodes, takes a selector string and returns an array-like object
// containing all the elements that it matches.

/*
<p>And if you go chasing
  <span class="animal">rabbits</span></p>
<p>And you know you're going to fall</p>
<p>Tell 'em a <span class="character">hookah smoking
  <span class="animal">caterpillar</span></span></p>
<p>Has given you the call</p>
*/

<script>
  function count(selector) {
    return document.querySelectorAll(selector).length;
  }
  console.log(count("p"));  // All <p> elements
  // -> 4
  console.log(count(".animal"));  // Class animal
  // -> 2
  console.log(count("p.animal")); // Animal inside of <p>
  // -> 2
  console.log(count("p > .animal")); // Direct child of <p>
</script>

// The querySelectorAll method returns an object that is not live, but it is
// still not a real array. The querySelector method works the same as the one
// with all but it only returns the first match.

    // Positioning and Animating

// The "position" style property is used to influence the layout of elements in
// a document. Its default value static, means that the element sits in its normal
// place in the document. When the value is set to relative, the top and left
// style properties can be used to move it relative to that normal place.

// When position is set to absolute, it is removed from the normal document flow,
// it no longer takes space and can overlap with other elements. Also, its
// top and left properties can be used to position it absolutely relative to the
// nearest enclosing element, whose position is not static, or relative to the
// doc if no such element exists. Position can be used to create an animation.

<p style="text-align: center">
  <img src="img/cat.png" style="position: relative">
</p>

<script>
  let cat = document.querySelector("img");
  let angle = Math.PI / 2;
  let lastTime = null;
  function animate(time, lastTime) {
    if (lastTime != null) {
      angle += (time - lastTime) * .001;
    }
    cat.style.top = (Math.sin(angle) * 20) + "px";
    cat.style.left = (Math.cos(angle) * 20) + "px";
    requestAnimationFrame(newTime => animate(newTime, time));
  }
  requestAnimationFrame(animate);
</script>

// The picture is initially centered on the screen and given a position value
// of relative to allow it to be moved. The requestAnimationFrame is used to
// schedule the animate function whenever the browser is ready to repaint itself.
// This happens at about 60 times per second.

// If we didn't use requestAnimationFrame and just used loops then the page
// would just freeze because browsers do not update their display while a JS
// program is running, nor do they allow any interation with the page. This is
// why we need it, to let the browser know that we are done for now.

// The speed at which the angle changes is based on the time difference b/w
// the current time and the last time the function ran, this ensures that the
// motion is stable, if it moved at a fixed rate then if another heavy task ran
// at the same time preventing our programming from running for a fraction of a
// second, then it would cause our program to stutter.

// The circular movement is done using the Math.sin for height, and Math.cos for
// width, the angles are measured in radians, with 2pi (6.28) as the max, as it
// modulos when it goes over. The cat animation code keeps a counter, angle, for
// the current angle of the animation and increments at every call.

// Styles also need units, in this case we use px for pixels, if no unit is
// provided then the browser will just ignore it.
