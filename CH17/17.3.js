/*
Use the requestAnimationFrame technique that we saw in Chapter 14 and Chapter 16
to draw a box with a bouncing ball in it. The ball moves at a constant speed and
bounces off the box’s sides when it hits them.
*/

<!doctype html>
<script src="code/chapter/16_game.js"></script>
<script src="code/levels.js"></script>
<script src="code/chapter/17_canvas.js"></script>

<canvas width="400" height="400"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let x = 10;
  let y = 10;
  let lastTime = null;

  function frame(time) {

    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function updateAnimation(step) {
    cx.strokeRect(0, 0, 250, 250);
    cx.beginPath();
    if (x >= 250 || y >= 250 ) {
      x = -x;
      y = -y;
    } else {
      x += 5;
      y += 5;
    }
    cx.arc(x, y, 5, 0, 7);
    cx.fill();
  }
</script>
