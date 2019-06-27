<!doctype html>

<tab-panel>
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</tab-panel>
<script>
  let divs = Array.from(document.querySelectorAll("div"));

  function asTabs(node) {
    for (let child of divs) {
      let button = document.createElement("button");
      button.textContent = child.getAttribute("data-tabname");
      node.parentNode.appendChild(button);
      child.style.display = "none";
    }
    document.querySelector("div").style.display = "inline";
  }

  window.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
     setTab(event.target.textContent);
      console.log(event.target.textContent);
    }
  });

  function setTab(tab) {
    for (div of divs) {
      if (div.getAttribute("data-tabname") == tab) {
        div.style.display = "inline";
        div.style.color = "red";
      }
	  else div.style.display = "none";
    }
  }

  asTabs(document.querySelector("tab-panel"));
</script>
