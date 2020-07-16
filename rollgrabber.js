
new MutationObserver(function mut (mutation,observer) {
	chrome.storage.local.get({
	    encounterRemoteHost: '',
	    encounterSend: false
	  }, function(items) {
	  	if (!items.encounterRemoteHost.startsWith('http'))  {
	  		return
	  	}
	  
console.log(mutation);
	for (let i=0;i<mutation.length;i++) {
		for (let m=0;m<mutation[i].addedNodes.length;m++) {		
			var results = mutation[i].addedNodes[m].getElementsByClassName('dice_result');
			if (results.length > 0) {
				let character_name = document.getElementsByClassName('ddbc-character-name')[0].textContent;
				let latest_roll = results[results.length - 1];
				let roll_title = latest_roll.getElementsByClassName('dice_result__info__rolldetail')[0].textContent.split(':')[0];
				let roll_notation = latest_roll.getElementsByClassName('dice_result__info__dicenotation')[0].textContent;
				let roll_breakdown = latest_roll.getElementsByClassName('dice_result__info__breakdown')[0].textContent;
				let roll_total = latest_roll.getElementsByClassName('dice_result__total-result')[0].textContent;
				let roll_type = latest_roll.getElementsByClassName('dice_result__rolltype')[0].textContent;
				let rolljson = {
								"source": character_name,
								"type":	"roll",
								"content": {
										"formula": roll_notation,
										"result": Number(roll_total),
										"detail": roll_breakdown,
										"name":	roll_title
								}
						};
				if (roll_type != "roll") {
					if (roll_type == "to hit") {
						rolljson.content.type = "attack";
					} else {
						rolljson.content.type = roll_type;
					}
				}
				var xhr = new XMLHttpRequest();
				xhr.open('POST', 'https://380cb22c.us-south.apigw.appdomain.cloud/ddb/dice', true);
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.withCredentials = true;
				xhr.send(JSON.stringify({"relayto":items.encounterRemoteHost, "data": rolljson }));
				return;
  		}
		}
	}
	});
}).observe(document,{ childList: true,subtree: true })
