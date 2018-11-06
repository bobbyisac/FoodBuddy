
'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.d19a5a3e-d8fb-4036-bf6b-90045a45d122';

const SKILL_NAME = 'Food Buddy';
const HELP_MESSAGE = 'You can use this skill to order food';
const HELP_REPROMPT = 'How Can I help you Today?';
const STOP_MESSAGE = 'Goodbye Folks!';

const Intro = 'Use me to hear whats on the menu today, place an order or remove an order'


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
