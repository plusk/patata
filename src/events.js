var ticks, sessionNr

var activeSession = false

chrome.browserAction.setBadgeBackgroundColor({
  color: '#0097A7'
})

// Set ticks based on settings and move on to start the timer
function setTimer () {
  chrome.storage.sync.get({
    sessionLength: 25
  }, function (syncData) {
    ticks = syncData.sessionLength
    sessionNr = 0

    // Clear break tabs in case there are any open (notable edge case: if timer is set during break)
    chrome.runtime.sendMessage({clearBreak: true})

    startTimer()
  })
}

// Start timer with alarm, badge and icon
function startTimer () {
  chrome.alarms.create('timer', {
    'periodInMinutes': 1
  })
  chrome.browserAction.setBadgeText({
    text: (ticks).toString()
  })
  chrome.browserAction.setIcon({
    path: 'img/potato.svg'
  })
  activeSession = true
  sessionNr++
}

// Reset timer to square one
function resetTimer () {
  chrome.storage.sync.get({
    sessionLength: 25
  }, function (syncData) {
    ticks = syncData.sessionLength
  })

  chrome.alarms.clear('timer', function () {
    chrome.browserAction.setBadgeText({
      text: ''
    })
    chrome.browserAction.setIcon({
      path: 'img/potato_off.svg'
    })
    activeSession = false
  })
}

// Make a new tab with a countdown timer for the break
function startBreak () {

  chrome.storage.sync.get({
    sessionRatio: 4
  }, function (syncData) {
    if (!(sessionNr % syncData.sessionRatio)) {
      // Nth break coming up, mark it as such
      chrome.storage.local.set({longBreak: true})
    }
  })

  chrome.tabs.create({
    url: chrome.runtime.getURL('countdown/countdown.html')
  })
}

// Update badge, turn off alarm if needed
function handleTick () {
  chrome.browserAction.setBadgeText({
    text: (--ticks).toString()
  })
  if (ticks === 0) {
    resetTimer()
    startBreak()
  }
}

// When alarm ticks, handle it
chrome.alarms.onAlarm.addListener(handleTick)

// When clicking extension, either start or reset timer
chrome.browserAction.onClicked.addListener(function () {
  activeSession ? resetTimer() : setTimer()
})

// If sync storage(options) changed, reset the timer
chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === 'sync') {
    resetTimer()
  }
})

// When a message is received
chrome.runtime.onMessage.addListener(function (request) {
  // Break is over, next session
  if (request.breakOver) {
    startTimer()
  }
})
