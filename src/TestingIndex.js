* nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.045843cb-12ef-4af0-8371-3a650b6c5131";  // TODO replace with your app ID (OPTIONAL).


var countriesArray = [
    {"Iran": [
        "Ravagh Persian Grill",
        "Taste of Persia",
        "Pars Grill House",
        "Colbeh",
        "Persepolis",
        "Patoug Persian Cuisine",
        "Shiraz Restaurant",
        "Shiraz Kitchen",
        "Chatanooga Persian",
        "Bijan's",
    ]},
    {"Iraq": [
        "Moustache"
    ]},
    {"Yemen": [
        "Yemen Cafe",
        "Yemen Cuisine",
        "Hadramout",
        "Maya Cuisine",
        "Grill 212"
    ]},
    {"Somalia": [
        "Safari Restaurant"
    ]},
    {"Syria": [
        "Al Salam Restaurant",
        "Balady Foods",
        "Damascus Bakery",
        "Cafe Rakka",
        "Aleppo",
        "Mansoura",
        "First Oasis",
        "Mar Mar",
        "Syrian Sweet Refuge"
    ]}
];

// this is used for keep track of visted nodes when we test for loops in the tree
var chosenRestaurant;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome to Eat the Ban. Want a suggestion or to browse by country?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say suggestion for a restaurant or browse to pick a country.";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say suggestion, browse, or cancel";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "You may want to eat here";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I can make a restaurant suggestion or you can tell me a country you want to browse.";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you soon!";

// --------------- Handlers -----------------------

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = countriesArray;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'SuggestionIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        var countryIndex = Math.floor(Math.random() * countriesArray.length);
        var randomCountryDict = countriesArray[countryIndex];
        var randomCountryArray = Object.values(randomCountryDict);
        var restaurantIndex = Math.floor(Math.random() * randomCountryArray.length);
        var chosenRestaurant =  randomCountryArray[restaurantIndex];

        var speechOutput = chosenRestaurant;
        this.emit(":tell", speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};