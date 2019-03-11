// Reverse Direction
<!doctype html>

<style>body { min-height: 200px }</style>
<img src="img/cat.png" id="cat" style="position: absolute">
<img src="img/hat.png" id="hat" style="position: absolute">

<script>
  let cat = document.querySelector("#cat");
  let hat = document.querySelector("#hat");

  let angle = 0;
  let lastTime = null;
  function animate(time) {
    if (lastTime != null) angle += (time - lastTime) * 0.001;
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 40 + 40) + "px";
    cat.style.left = (Math.cos(angle) * 200 + 230) + "px";
	let angle2 = angle - Math.PI;
    hat.style.top = (Math.sin(angle) * 40 + 40) + "px";
    hat.style.left = (Math.cos(angle2) * 200 + 230)+ "px";

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>

// Hat orbiting around cat
<!doctype html>

<style>body { min-height: 200px }</style>
<img src="img/cat.png" id="cat" style="position: absolute">
<img src="img/hat.png" id="hat" style="position: absolute">

<script>
  let cat = document.querySelector("#cat");
  let hat = document.querySelector("#hat");

  let angle = 0;
  let lastTime = null;
  function animate(time) {
    if (lastTime != null) angle += (time - lastTime) * 0.001;
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 40 + 40) + "px";
    cat.style.left = (Math.cos(angle) * 200 + 230) + "px";
    hat.style.top = (Math.sin(angle + 4 )) *40 + 40 + "px";
    hat.style.left = (Math.cos(angle+ 3) * 200 + 230)+ "px";

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>
