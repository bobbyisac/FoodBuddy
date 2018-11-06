
'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.0371c1f8-8433-40bc-958d-00c0a97dee2b';

const SKILL_NAME = 'Infinity Club';
const HELP_MESSAGE = 'Welcome to the alexa skill for Infinity club! You can ask the skill to introduce';
const HELP_REPROMPT = 'How Can I help you Today?';
const STOP_MESSAGE = 'Goodbye Folks!';

const Intro = 'Welcome to Infinity! Infinity is an initiative by some students of Department of Computer Science and Engineering, Amal Jyothi College of Engineering. At infinity, we encourage you to develop and upgrade your skills. We meet after class hours, to discuss new technologies and problems faced by our budding developers. Welcome to INFINITY once again! we hope you have a great time '


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
