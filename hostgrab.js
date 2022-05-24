chrome.storage.local.get({
	    encounterAutoHost: true
	  }, function(items) {
	  if (items.encounterAutoHost) {
          let url = new URL(window.location)
          let remoteHost = localStorage?.getItem('lastSuccessfullHost')
          if (remoteHost == url.host) chrome.storage.local.set({encounterRemoteHost: `${url.protocol}//${remoteHost}`});
	  }
});
