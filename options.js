// Saves options to chrome.storage
function save_options() {
  var remoteHost = document.getElementById('remoteHost').value;
  var autoHost = document.getElementById('autoHost').checked;
  var sendVM = document.getElementById('sendVM').checked;
  var vmList = document.getElementById('vmList').value;
  if (!remoteHost.startsWith("http") && remoteHost.length > 4) {
    remoteHost = "http://" + remoteHost;
    document.getElementById('remoteHost').value = remoteHost;
  }
  chrome.storage.local.set({
    encounterRemoteHost: remoteHost,
    encounterAutoHost: autoHost,
    sendVM: sendVM,
    vmList: vmList,
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
    encounterAutoHost: true,
    sendVM: false,
    vmList: "",
  }, function(items) {
    document.getElementById('remoteHost').value = items.encounterRemoteHost;
    document.getElementById('autoHost').checked = items.encounterAutoHost;
    document.getElementById('sendVM').checked = items.sendVM;
    document.getElementById('vmList').value = items.vmList;
  });
}
document.addEventListener('DOMContentLoaded', function(){
	restore_options();
	document.getElementById('save').addEventListener('click',save_options);
});
