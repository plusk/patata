var btn = document.getElementById('go')

function startBreak() {
  btn.parentNode.removeChild(btn)
}

btn.onclick = function () {
  var docElement = document.documentElement

  if (docElement.requestFullscreen) {
    docElement.requestFullscreen()
  }
  else if (docElement.mozRequestFullScreen) {
    docElement.mozRequestFullScreen()
  }
  else if (docElement.webkitRequestFullScreen) {
    docElement.webkitRequestFullScreen()
  }
  else if (docElement.msRequestFullscreen) {
    docElement.msRequestFullscreen()
  }

  startBreak()
}
