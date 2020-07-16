// Saves options to chrome.storage
function save_options() {
  var remoteHost = document.getElementById('remoteHost').value;
  chrome.storage.local.set({
    encounterRemoteHost: remoteHost
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    encounterRemoteHost: '',
  }, function(items) {
    document.getElementById('remoteHost').value = items.encounterRemoteHost;
  });
}
document.addEventListener('DOMContentLoaded', function(){
	restore_options();
	document.getElementById('save').addEventListener('click',save_options);
});
