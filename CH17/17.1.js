/*
Write a program that draws the following shapes on a canvas:

1. A trapezoid (a rectangle that is wider on one side)
2. A red diamond (a rectangle rotated 45 degrees or ¼π radians)
3. A zigzagging line
4. A spiral made up of 100 straight line segments
5. A yellow star

The shapes to draw When drawing the last two, you may want to refer to the
explanation of Math.cos and Math.sin in Chapter 14, which describes how to get
coordinates on a circle using these functions.

I recommend creating a function for each shape. Pass the position, and optionally
other properties such as the size or the number of points, as parameters. The
alternative, which is to hard-code numbers all over your code, tends to make the
code needlessly hard to read and modify.
*/

<!doctype html>

// Question 1
<canvas width="600" height="200"></canvas>
<script>
function drawTrapezoid(x, y) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(x, y);
    cx.lineTo(x + 70, y);
    cx.lineTo(x + 90, y + 40);
    cx.lineTo(x - 20, y + 40);
    cx.closePath();
    cx.stroke();
}
drawTrapezoid(30, 30);
</script>

// Question 2
<script>
function drawRedSquare(x, y) {
  let cx = document.querySelector("canvas").getContext("2d");
  cx.fillStyle = "red";
  cx.rotate(45 * Math.PI / 180);
  cx.fillRect(x, y, 75, 75);
}
drawRedSquare(75, 0);
</script>

// Question 3
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  function drawZigZag(x, y, levels) {
    cx.beginPath();
    cx.moveTo(x, y);
    for (let i = 1; i <= levels; i++) {
   		cx.lineTo(x + 100, y + (i * 12));
    	cx.lineTo(x, y + (i * 15));
  	}
       	cx.stroke();
  }
  drawZigZag(30, 30, 5);
</script>

  // Recursive version
  <script>
    let cx = document.querySelector("canvas").getContext("2d");
    function drawZigZag(x, y, levels, length) {
      if (levels < 1) return;
      cx.save();
      cx.translate(0, y + (levels * 10));
      cx.rotate(-.1);
      cx.fillRect(0, 0, length, 1);
      //cx.restore();
      cx.translate(length, 0);
      cx.rotate(.2);
      cx.fillRect(0, 0, (-length), 1);
      cx.restore();
      drawZigZag(x, y, (levels - 2), length);
    }
    drawZigZag(30, 30, 9, 100);
  </script>

 // Question 4
 <script>
 <script>
   let cx = document.querySelector("canvas").getContext("2d");
   function drawSpiral(finalRadius) {
 	cx.beginPath();
     cx.translate(100, 100);
     for (let i = 0; i < finalRadius; i += .1) {
       cx.arc(0, 0, i, i/Math.PI, (i +.1)/Math.PI);
       console.log(Math.cos(i / Math.PI) + (i * 10), Math.sin(i / Math.PI) + (i * 10));
       //cx.arc(0,0, i, i/Math.PI, (i+1)/Math.PI);
     }
     cx.stroke();
   }
   drawSpiral(50);
 </script>

 // Question 5
 <script>
   let cx = document.querySelector("canvas").getContext("2d");
   function drawStar(x, y, radius, points, colour) {
     cx.fillStyle = colour;
   	cx.translate(x, y);
     cx.beginPath();
     cx.moveTo(radius, 0);
     let slice = Math.PI * 2 / points;

     for (let i = 1; i <= points; i++) {
     	cx.quadraticCurveTo(0, 0, Math.cos(slice * i) * radius, Math.sin(slice * i) * radius);
     }
     cx.fill();
   }
   drawStar(100, 100, 50, 8, "gold");
 </script>
