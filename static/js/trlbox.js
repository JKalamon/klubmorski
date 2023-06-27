document.addEventListener("DOMContentLoaded", function() {
  var layer = document.createElement("div");
  layer.classList = "cocobox-wrapper"
  layer.innerHTML = "<button>x</button>";
  layer.style.cssText = "display:none";
  document.body.appendChild(layer);
  layer.onclick = function() { layer.style.display = "none" };
  var boxes = document.getElementsByClassName("cocobox");
  for(var i = 0; i < boxes.length; ++i) {
    boxes[i].addEventListener("click", function(e) {
      e.preventDefault();
      var img = new Image();
      img.src = e.target.parentNode.href ?? e.target.href;
      layer.innerHTML = "";
      layer.appendChild(img);
      layer.style.display = "flex";
      setTimeout(function() {
        img.style.transform = "scale(1.1)";
      }, 50);
    });
  }
});