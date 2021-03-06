'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.d19a5a3e-d8fb-4036-bf6b-90045a45d122';

const SKILL_NAME = 'Food Buddy';
const HELP_MESSAGE = 'Welcome to Food Buddy! you can use this skill to place an order';
const HELP_REPROMPT = 'How Can I help you Today?';
const STOP_MESSAGE = 'Goodbye Folks!';

const Intro = HELP_MESSAGE;

const handlers = {
    'LaunchRequest': function () {
        this.emit('Introduce');
    },
    'Introduce': function () {
        const speechOutput = Intro;
        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
	'GetMenuIntent': function () {
		const request = require('request');
		const url = `https://9nfmj2dq1f.execute-api.ap-south-1.amazonaws.com/Development/menu/get-all`;
		let speechOutput = "Items on today's menu are : ";
		var self=this;
		new Promise(function(resolve, reject) {
			request.get(url, (error, response, body) => {
				let responseObj = JSON.parse(body);
				if (!error)
				{
					resolve([responseObj,self]);
				}
				else{
					reject(error);
				}
			});
		}).then(function(a) {
			let responseObj=a[0];
			let self=a[1];
			let arindex = responseObj.Menu_ITEMS.length;
			let i;
			for (i=0;i<arindex;i++) {
				speechOutput = speechOutput + responseObj.Menu_ITEMS[i].ItemName;
				speechOutput = speechOutput + " priced at rupees " + responseObj.Menu_ITEMS[i].Price;
				if (i < (arindex-2)){
					speechOutput = speechOutput + ", ";
				}
				else if (i == arindex-2){
					speechOutput = speechOutput + " and ";
				}
				else if (i == arindex-1){
					speechOutput = speechOutput + ".";
				}
			}
			self.response.cardRenderer(SKILL_NAME, speechOutput);
			self.response.speak(speechOutput);
			self.emit(':responseReady');
		}).catch();
	},
	'PlaceOrderIntent': function () {
		const request = require('request');
		const url1 = 'https://9nfmj2dq1f.execute-api.ap-south-1.amazonaws.com/Development/orders/add-order';
		let speechOutput = "Order placed for ";
		
		let filledSlots = delegateSlotCollection.call(this, function(event) {
			let result = false;
			let slots = event.request.intent.slots;

			if(slots.menuItem.value) {
				result = true;
			}
			return result;
		});
		
		if (!filledSlots) {
			return;
		}
		let slotValues = getSlotValues(filledSlots);
		speechOutput = speechOutput + slotValues.menuItem.resolved;
		let item1=slotValues.menuItem.resolved;
		let data1={
			 "IDNo":"1111",
			 "OrderDate": formatDate(new Date()),
			 "OrderedItems":item1
			 };
		request.post({
			url: url1,
			body: JSON.stringify(data1)
		}, function(error, response, body){
        console.log(body);
		});
		
		this.response.cardRenderer(SKILL_NAME, speechOutput);
		this.response.speak(speechOutput);
		this.emit(':responseReady');
	},
	'ViewOrderIntent': function () {
	},
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

function getSlotValues (filledSlots) {
    let slotValues = {};
    Object.keys(filledSlots).forEach(function(item) {
    var name = filledSlots[item].name;
    if(filledSlots[item]&&
        filledSlots[item].resolutions &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {
        switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
            case "ER_SUCCESS_MATCH":
                slotValues[name] = {
                    "synonym": filledSlots[item].value,
                    "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                    "isValidated": true
                };
                break;
            case "ER_SUCCESS_NO_MATCH":
                slotValues[name] = {
                    "synonym": filledSlots[item].value,
                    "resolved": filledSlots[item].value,
                    "isValidated":false
                };
                break;
            }
        } else {
            slotValues[name] = {
                "synonym": filledSlots[item].value,
                "resolved": filledSlots[item].value,
                "isValidated": false
            };
        }
    },this);
    return slotValues;
}

function delegateSlotCollection(func) {
    if(func) {
        if (func(this.event)) {
            this.event.request.dialogState = "COMPLETED";
            return this.event.request.intent.slots;
        }
    }

    if (this.event.request.dialogState === "STARTED") {
        var updatedIntent = this.event.request.intent;
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        this.emit(":delegate", updatedIntent);
    } else {
        return this.event.request.intent.slots;
    }
    return null;
}

function formatDate(date) {
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return day + '-' + monthNames[monthIndex] + '-' + year.toString().slice(2,4);
}

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
