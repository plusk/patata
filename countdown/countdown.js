var docElement = document.documentElement

var divCenter = document.getElementById('divCenter')
var btnGo = document.getElementById('btnGo')
var timer = document.createElement('p')

// Convert remaining duration to an output string
function toTimerText (duration) {
  var min = parseInt(duration / 60, 10)
  var sec = parseInt(duration % 60, 10)

  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec

  return min + ':' + sec
}

function startBreak () {
  // Replace button with timer
  divCenter.removeChild(btnGo)
  divCenter.appendChild(timer)

  var duration = 30

  // Initial string and tick
  timer.textContent = toTimerText(duration)
  duration--

  // One tick per second
  var tick = setInterval(function () {
    timer.textContent = toTimerText(duration)

    // Stop ticking at 0 and close the tab
    if (--duration < 0) {
      clearTimeout(tick)
      close()
    }
  }, 1000)

  document.getElementById('main').className += ' activated'
}

// Go fullscreen and start break when ready to go
btnGo.onclick = function () {

  // Browser compatibility filler
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
