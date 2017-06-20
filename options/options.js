// Set options
function saveOptions () {
  var sessionLength = document.getElementById('sessionLength').value

  chrome.storage.sync.set({
      sessionLength: sessionLength
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
    sessionLength: 25
  }, function (data) {
    document.getElementById('sessionLength').value = data.sessionLength
  })
}

// Save options when clicking... Save.
document.getElementById('save').addEventListener('click', saveOptions)

// Restore options when loading up the menu
document.addEventListener('DOMContentLoaded', restoreOptions)
