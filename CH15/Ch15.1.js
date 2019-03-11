<!doctype html>

<p>🎈</p>

<script>
let para = document.querySelector("p");

para.style.fontSize = "10" + "px";
window.addEventListener("keydown", event => {
  let size = para.style.fontSize.replace('px', '');
  if (size >= 20) {
      para.textContent = "💥";
      window.removeEventListener("keydown", change);
  }
  else window.addEventListener("keydown", change(event, size));
});

function change(event, size) {
  if (event.key == "ArrowUp") {
    para.style.fontSize = size * 1.1 + "px";
    event.preventDefault();
  } else if (event.key = "ArrowDown") {
      para.style.fontSize = size * .9 + "px";
      event.preventDefault();
  }
}
</script>
