const period = 0.01

const maxTicks = 25
var ticks = maxTicks

var alarmOn = false

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

function startAlarm () {
  chrome.alarms.create('timer', {
    'periodInMinutes': period
  })
  chrome.browserAction.setBadgeText({
    text: (ticks).toString()
  })
  chrome.browserAction.setIcon({
    path: 'img/potato.svg'
  })
  alarmOn = true
}

function resetAlarm () {
  ticks = maxTicks;
  chrome.alarms.clear('timer', function () {
    chrome.browserAction.setBadgeText({
      text: ''
    })
    chrome.browserAction.setIcon({
      path: 'img/potato_off.svg'
    })
    alarmOn = false
  })
}

function toggleAlarm () {
  if (!alarmOn) {
    startAlarm()
  }
  else {
    resetAlarm()
  }
}

// Update badge, turn off alarm if needed
function handleTick () {
  console.log(ticks)
  chrome.browserAction.setBadgeText({
    text: (--ticks).toString()
  })
  if (ticks === 0) {
    resetAlarm()
  }
}

// When alarm ticks, handle it
chrome.alarms.onAlarm.addListener(handleTick)

// Turn on/off alarm
chrome.browserAction.onClicked.addListener(toggleAlarm)
