// Used for fullscreening based on vendor
var docElement = document.documentElement

// Setup for DOM
var divCenter = document.getElementById('divCenter')
var btnGo = document.getElementById('btnGo')
var divP = document.createElement('div')
divP.setAttribute('id', 'divP')
var timer = document.createElement('p')
divP.appendChild(timer)
var btnRe = document.getElementById('btnRe')

// Declare sheet for rule insertions
var sheet = document.getElementById('sheet').sheet

// Duration of break in seconds
var duration

// Set duration of break based on stored syncData
chrome.storage.sync.get({
    breakLength: 5,
    longBreakLength: 15
  }, function (syncData) {
    chrome.storage.local.get('longBreak', function (localData) {
      // Set duration based on break type and convert it to seconds
      if (localData.longBreak) {
        duration = syncData.longBreakLength * 60
        chrome.storage.local.set({longBreak: false})
      }
      else {
        duration = syncData.breakLength * 60
      }
      // Set animations based on duration
      sheet.insertRule('.activated {animation: colorchange ' + duration + 's infinite;}', 0)
      sheet.insertRule('.activated #halfclip {animation: cliprotate ' + duration + 's steps(2) infinite;}', 0)
      sheet.insertRule('.activated #fixed {animation: showfixed ' + duration + 's steps(2) infinite;}', 0)
      sheet.insertRule('.activated #clipped {animation: rotate ' + duration / 2 + 's linear infinite;}', 0)
    })
  }
)

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
  divCenter.appendChild(divP)

  // Initial string and tick
  timer.textContent = toTimerText(duration)
  duration--

  // One tick per second
  var tick = setInterval(function () {
    timer.textContent = toTimerText(duration)

    // Stop ticking at 0, wait for user input
    if (--duration < 0) {
      clearTimeout(tick)

      // Clear out elements we won't use more of
      divCenter.removeChild(divP)
      divCenter.removeChild(document.getElementById('countdown'))

      // Turn off style rules tied to this class, namely background color
      document.getElementById('main').classList.remove('activated')

      // Show the final button
      btnRe.style.display = 'block'
    }
  }, 1000)

  document.getElementById('main').classList.add('activated')
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

// Notify background script that break is over before closing
btnRe.onclick = function () {
  chrome.runtime.sendMessage({breakOver: true})
  close()
}

// Somewhat of an edge case, close any break tabs if options change to clean up
chrome.storage.onChanged.addListener(function (changes, area) {
  // If sync storage(options) changed, close any break tabs
  if (area === 'sync') {
    close()
  }
})

chrome.runtime.onMessage.addListener(function (request) {
  // Another edge case: if timer started during break, close break tab(s)
  if (request.clearBreak) {
    close()
  }
})
