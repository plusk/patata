const period = 0.01

const maxTicks = 5
var ticks = maxTicks

var alarmed = false

/*
 // Trying to get settings, doesn't seem to work yet
 function syncTicks () {
 chrome.storage.sync.get({
 sessionLength: 25
 }, function (data) {
 ticks = data.sessionLength
 }
 )
 }
 */

function startTimer () {
  chrome.alarms.create('timer', {
    'periodInMinutes': period
  })
  chrome.browserAction.setBadgeText({
    text: (ticks).toString()
  })
  chrome.browserAction.setIcon({
    path: 'img/potato.svg'
  })
  alarmed = true
}

function resetTimer () {
  ticks = maxTicks
  chrome.alarms.clear('timer', function () {
    chrome.browserAction.setBadgeText({
      text: ''
    })
    chrome.browserAction.setIcon({
      path: 'img/potato_off.svg'
    })
    alarmed = false
  })
}

function toggleTimer () {
  if (!alarmed) {
    startTimer()
  }
  else {
    resetTimer()
  }
}

// Make a new tab with a countdown timer for the break
function startBreak () {
  chrome.tabs.create({
    url: chrome.runtime.getURL('countdown/countdown.html')
  })
}

// Update badge, turn off alarm if needed
function handleTick () {
  console.log(ticks)
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

// Turn on/off alarm
chrome.browserAction.onClicked.addListener(toggleTimer)
