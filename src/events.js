// Set ticks based on settings and move on to start the timer
function setTimer () {
  chrome.storage.sync.get({sessionLength: 25}, function (syncData) {
    chrome.storage.local.set({
      sessionNr: 0,
      ticks: syncData.sessionLength
    })

    // Clear break tabs in case there are any open (notable edge case: if timer is set during break)
    chrome.runtime.sendMessage({clearBreak: true})

    startTimer()
  })
}

// Start timer with alarm, badge and icon
function startTimer () {
  chrome.storage.local.get(['sessionNr', 'ticks'], function (localData) {
    chrome.alarms.create('timer', {
      'periodInMinutes': 1
    })
    chrome.browserAction.setBadgeText({
      text: (localData.ticks).toString()
    })
    chrome.browserAction.setIcon({
      path: 'img/potato.svg'
    })
    chrome.storage.local.set({
      sessionNr: ++localData.sessionNr,
      sessionActive: true
    })
  })
}

// Reset timer to square one
function resetTimer () {
  chrome.storage.sync.get({sessionLength: 25}, function (syncData) {
    chrome.storage.local.set({ticks: syncData.sessionLength})
  })
  chrome.alarms.clear('timer', function () {
    chrome.browserAction.setBadgeText({
      text: ''
    })
    chrome.browserAction.setIcon({
      path: 'img/potato_off.svg'
    })
    chrome.storage.local.set({sessionActive: false})
  })
}

// Make a new tab with a countdown timer for the break
function startBreak () {
  chrome.storage.sync.get({sessionRatio: 4}, function (syncData) {
    chrome.storage.local.get('sessionNr', function (localData) {

      if (!(localData.sessionNr % syncData.sessionRatio)) {

        // Nth break coming up, mark it as such
        chrome.storage.local.set({longBreak: true})
      }

      // Make the tab and with the countdown url
      chrome.tabs.create({
        url: chrome.runtime.getURL('countdown/countdown.html')
      })
    })
  })
}

// Update badge, turn off alarm if needed
function handleTick () {

  // Get ticks from local storage
  chrome.storage.local.get('ticks', function (localData) {

    var ticks = localData.ticks

    chrome.storage.local.set({ticks: --ticks}, function () {
      chrome.browserAction.setBadgeText({
        text: ticks.toString()
      })
      if (ticks === 0) {
        resetTimer()
        startBreak()
      }
    })
  })
}

// When alarm ticks, handle it
chrome.alarms.onAlarm.addListener(handleTick)

// When clicking extension, either start or reset timer
chrome.browserAction.onClicked.addListener(function () {
  chrome.storage.local.get('sessionActive', function (localData) {
    localData.sessionActive ? resetTimer() : setTimer()
  })
})

// If sync storage(options) changed, reset the timer
chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === 'sync') {
    resetTimer()
  }
})

// When a message is received, break is over, start next session
chrome.runtime.onMessage.addListener(function (request) {
  if (request.breakOver) {
    startTimer()
  }
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#0097A7'
  })
})
