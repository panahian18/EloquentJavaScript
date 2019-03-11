<!doctype html>

<style>
  .trail { /* className for the trail elements */
    position: absolute;
    height: 6px; width: 6px;
    border-radius: 3px;
    background: teal;
  }
  body {
    height: 300px;
  }
</style>

<script>
  let trailElements = [];
  window.addEventListener("mousemove", event => {
    let trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = event.clientX + "px";
    trail.style.top = event.clientY + "px";

    if (trailElements.length > 10) {
     	trailElements.shift();
        trailElements.push(trail);
    } else trailElements.push(trail);

    for (let dot; dot = document.querySelector("div");) {
		dot.remove();
    }
    for (let i of trailElements) {
     	document.body.appendChild(i);
    }
  });
</script>
