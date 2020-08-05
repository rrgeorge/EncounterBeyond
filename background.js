if (chrome.declarativeContent) {
chrome.runtime.onInstalled.addListener(function() {
  //	 Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostSuffix: '.dndbeyond.com',
              pathContains: '/characters/',
              pathPrefix: '/profile/' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
}

function sendToEncounter(host,json,also=null) {
	let url = new URL("/api/messages",host)
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url.toString(), true);
	xhr.setRequestHeader("Content-type", "application/json");
	if (also) {
		xhr.onload = function () { sendToEncounter(host,also) };
	}
	xhr.send(JSON.stringify(json));
}

function handleMessage(request, sender, sendResponse) {
	if (request.message == "sendToEncounter") {
		sendToEncounter(request.host,request.json,request.also);
	}
}

chrome.runtime.onMessage.addListener(handleMessage);