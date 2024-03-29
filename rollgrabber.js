console.log("EncounterBeyond")
new MutationObserver(function mut (mutation,observer) {
	chrome.storage.local.get({
	    encounterRemoteHost: '',
	    sendVM: false,
	    vmList: ''
	  }, function(items) {
	  	if (!items.encounterRemoteHost.startsWith('http'))  {
	  		return
	  	}
	for (let i=0;i<mutation.length;i++) {
		for (let m=0;m<mutation[i].addedNodes.length;m++) {
			if (mutation[i].addedNodes[m].nodeType != Node.ELEMENT_NODE) {
				continue;
			}
			let results = mutation[i].addedNodes[m].getElementsByClassName('dice_result');
			if (results.length > 0) {
				let character_name = document.querySelector(".ct-character-header-info")?.querySelector("h1")?.textContent || "Player Character"
				let latest_roll = results[results.length - 1];
				let roll_title = latest_roll.getElementsByClassName('dice_result__info__title')[0].textContent.split(':')[0];
				let roll_notation = latest_roll.getElementsByClassName('dice_result__info__dicenotation')[0].textContent;
				let roll_breakdown = latest_roll.getElementsByClassName('dice_result__info__breakdown')[0].textContent;
				let roll_total = latest_roll.getElementsByClassName('dice_result__total-result')[0].textContent;
				let roll_type = latest_roll.getElementsByClassName('dice_result__rolltype')[0].textContent;
				let roll_header = latest_roll.getElementsByClassName("dice_result__total-header");
				if (roll_header.length > 0) {
					roll_title += ` (${roll_header[0].textContent})`;
				}
				let rolljson = {
								"source": character_name,
								"type":	"roll",
								"content": {
										"formula": roll_notation,
										"result": Number(roll_total),
										"detail": roll_breakdown,
										"name":	roll_title?.trim()
								}
						};
				if (["check","save","attack","damage"].includes(roll_type)) {
					rolljson.content.type = roll_type;
				} else if (roll_type == "to hit") {
					rolljson.content.type = "attack";
					if (document.getElementsByClassName('ddbc-combat-attack--crit').length > 0) {
						rolljson.content.name += " (CRIT)";
					}
				}
				let dicetoolbar = document.getElementsByClassName('dice-toolbar')[0];
				if (dicetoolbar) {
					let color = window.getComputedStyle(dicetoolbar).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
					if (color) {
						let colorHex = "#" + ("0"+parseInt(color[1]).toString(16)).slice(-2) + ("0"+parseInt(color[2]).toString(16)).slice(-2) + ("0"+parseInt(color[3]).toString(16)).slice(-2);
						rolljson.color = colorHex;
					}
				}
				var msgjson = null;
				if (roll_title.toLowerCase() == "vicious mockery" && items.sendVM) {
					let vmList = items.vmList.split("\n")
					if (vmList.length > 0) {
						msgjson = {
							"source": character_name,
							"type":	"chat",
							"content": '"'+vmList[Math.floor(Math.random()*vmList.length)]+'"'							};
					}
					let dicetoolbar = document.getElementsByClassName('dice-toolbar')[0];
					if (dicetoolbar) {
						let color = window.getComputedStyle(dicetoolbar).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						if (color) {
							let colorHex = "#" + ("0"+parseInt(color[1]).toString(16)).slice(-2) + ("0"+parseInt(color[2]).toString(16)).slice(-2) + ("0"+parseInt(color[3]).toString(16)).slice(-2);
							msgjson.color = colorHex;
						}
					}
				}
				chrome.runtime.sendMessage({
					"message":	"sendToEncounter",
					"host":		items.encounterRemoteHost,
					"json":		rolljson,
					"also":		msgjson
					});
				return;
  			}
  			results = mutation[i].addedNodes[m].getElementsByClassName('ct-spell-detail__description');
  			let actiontype = "spell";
  			let actionname = ""
  			if (results[0]) {
  				actionname = mutation[i].addedNodes[m].getElementsByClassName('ddbc-spell-name')[0].textContent;
  			} else {
  				results = mutation[i].addedNodes[m].getElementsByClassName('ct-action-detail__description');
  				if (results[0]) {
  					actiontype = "action";
  					actionname = mutation[i].addedNodes[m].getElementsByClassName('ddbc-action-name')[0].textContent;
  				}
  			}
			if (results.length > 0 && !document.getElementById('sendTextToEncounter')) {
				let sendtoEDiv = document.createElement("div");
				sendtoEDiv.style.textAlign = "right";
				sendtoEDiv.style.marginTop = 10;
				let sendtoEButton = document.createElement("button");
				sendtoEButton.id = 'sendTextToEncounter';
				sendtoEButton.classList.add('ct-theme-button','ct-theme-button--filled','ct-theme-button--interactive','ct-button','character-button');
				sendtoEButton.innerText = 'Share on EncounterPlus';
				sendtoEButton.style.textAlign = "right";
				let character_name = document.querySelector(".ct-character-header-info")?.querySelector("h1")?.textContent || "Player Character"
				let msgjson = {
					"source": character_name + " shared the " + actiontype + ": \"" + actionname + "\"",
					"type":	"chat",
					"content": results[0].innerText
					};
				let dicetoolbar = document.getElementsByClassName('dice-toolbar')[0];
				if (dicetoolbar) {
					let color = window.getComputedStyle(dicetoolbar).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
					if (color) {
						let colorHex = "#" + ("0"+parseInt(color[1]).toString(16)).slice(-2) + ("0"+parseInt(color[2]).toString(16)).slice(-2) + ("0"+parseInt(color[3]).toString(16)).slice(-2);
						msgjson.color = colorHex;
					}
				}
				sendtoEButton.addEventListener('click',function(){
					chrome.runtime.sendMessage({
						"message":	"sendToEncounter",
						"host":		items.encounterRemoteHost,
						"json":		msgjson,
						"also":		null
						});
					});
				results[0].appendChild(sendtoEDiv);
				sendtoEDiv.appendChild(sendtoEButton);
			}
		}
	}
	});
}).observe(document,{ childList: true,subtree: true })
