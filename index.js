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
		const url = `https://9nfmj2dq1f.execute-api.ap-south-1.amazonaws.com/Development/menu/get-all`;
		var speechOutput = "Items on today's menu are : ";
		request.get(url, (error, response, body) => {
		var responseObj = JSON.parse(body);
		var arindex = responseObj.Menu_ITEMS.length;
		var i;
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
		});
		console.log("speech:",speechOutput);
        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
	},
	'PlaceOrderIntent': function () {
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

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
