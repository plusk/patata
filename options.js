
// Set options
function save_options() {
  var sessionLength = document.getElementById("sessionLength").value;

  chrome.storage.sync.set({
    sessionLength: sessionLength
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(function() {
      status.textContent = "";
    }, 2000);
  });
}

// Get stored options
function restore_options() {

  chrome.storage.sync.get({
    sessionLength: 25
  }, function(data) {
    document.getElementById("sessionLength").value = data.sessionLength;
  });
}

// Save options when clicking... Save.
document.getElementById("save").addEventListener("click", save_options);

// Restore options when loading up the menu
document.addEventListener("DOMContentLoaded", restore_options);
