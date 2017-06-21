// Set options
function saveOptions () {
  var sessionLength = document.getElementById('sessionLength').value
  var breakLength = document.getElementById('breakLength').value

  chrome.storage.sync.set({
      sessionLength: sessionLength,
      breakLength: breakLength
    }, function () {
      // Feedback for user
      var status = document.getElementById('status')
      status.textContent = 'Options saved.'
      setTimeout(function () {
        status.textContent = ''
      }, 2000)
    }
  )
}

// Get stored options
function restoreOptions () {
  chrome.storage.sync.get({
    sessionLength: 25,
    breakLength: 5
  }, function (data) {
    document.getElementById('sessionLength').value = data.sessionLength
    document.getElementById('breakLength').value = data.breakLength
  })
}

// Save options when clicking... Save.
document.getElementById('save').addEventListener('click', saveOptions)

// Restore options when loading up the menu
document.addEventListener('DOMContentLoaded', restoreOptions)
