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