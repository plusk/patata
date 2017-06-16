// Stuffy values
const period = 0.01;

var ticks = 0;
var alarmOn = false;

function resetAlarm() {
  chrome.alarms.clear('potato powers activate', function() {
    ticks = 0;

    chrome.browserAction.setBadgeText({
      text: ""
    });

    chrome.browserAction.setIcon({
      path: "img/potato_off.svg"
    })

    alarmOn = false;
  })
}


function toggleAlarm(clickInfo) {
  // Make the alarm that will rock the world
  if (!alarmOn) {
    chrome.alarms.create('potato powers activate', {
      "periodInMinutes": period
    });
     chrome.browserAction.setIcon({
      path: "img/potato.svg"
    })
    alarmOn = true;
  }
  else {
    resetAlarm();
  }
}


// When clicked, make alarms
chrome.browserAction.onClicked.addListener(toggleAlarm);

function handleTick() {
  console.log(ticks);
  chrome.browserAction.setBadgeText({
    text: (++ticks).toString()
  });
}

// Basically on tick, maybe have sublisteners for end of ticks etc.
chrome.alarms.onAlarm.addListener(handleTick);

// Try to clean up before reload/suspend?
chrome.runtime.onSuspend.addListener(function() {
  console.log("Trying to suspend");
  resetAlarm();
});
