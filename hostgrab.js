chrome.storage.local.get({
	    encounterAutoHost: true
	  }, function(items) {
	  if (items.encounterAutoHost) {
		let url = new URL(window.location)
		if (url.searchParams.has("remoteHost")) {
			let remoteHost = url.searchParams.get("remoteHost");
			if (!remoteHost.startsWith("http")) {
				remoteHost = url.protocol + "//" + remoteHost;
			}
			chrome.storage.local.set({encounterRemoteHost: remoteHost});
		}
	  }
});