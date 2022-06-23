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
              pathContains: '/characters/'
              },
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

        fetch(url.toString(),{
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(json)
        }).then(()=>{
            if (also) {
                sendToEncounter(host,also)
            }
        })
}

function handleMessage(request, sender, sendResponse) {
	if (request.message == "sendToEncounter") {
		sendToEncounter(request.host,request.json,request.also);
	}
}

chrome.runtime.onMessage.addListener(handleMessage);
