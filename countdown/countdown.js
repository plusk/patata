var docElement = document.documentElement

var divCenter = document.getElementById('divCenter')
var btnGo = document.getElementById('btnGo')
var timer = document.createElement('p')

function tickTimer (length) {
  var min = parseInt(length / 60, 10)
  var sec = parseInt(length % 60, 10)

  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec

  return min + ':' + sec
}

function startBreak () {
  divCenter.removeChild(btnGo)
  divCenter.appendChild(timer)

  var length = 5

  timer.textContent = tickTimer(length)
  length--

  var tick = setInterval(function () {
    timer.textContent = tickTimer(length)

    if (--length < 0) {
      clearTimeout(tick)
      close()
    }
  }, 1000)

}

btnGo.onclick = function () {

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
