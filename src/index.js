'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.045843cb-12ef-4af0-8371-3a650b6c5131";  // TODO replace with your app ID (OPTIONAL).


var countriesArray = [
    {"Iran": [
        {"Ravagh Persian Grill": {
            "Locations": [
                "11 E 30th St, Manhattan", 
                "1135 1st Ave, Manhattan", 
                "125 1st Ave, Manhattan"
            ]
        }},
        {"Taste of Persia": {
            "Locations": [
                "12 W 18th St, Manhattan" 
            ]
        }},
        {"Pars Grill House": {
            "Locations": [
                "249 W 26th St, Manhattan"
            ]
        }},
        {"Colbeh": {
            "Locations": [
                "75 N Station Plaza, Great Neck"
            ]
        }},
        {"Persepolis": {
            "Locations": [
                "1407 2nd Ave, Manhattan"
            ]
        }},
        {"Patoug Persian Cuisine": {
            "Locations": [
                "220-06 Horace Harding Expy, Queens"
            ]
        }},
        {"Shiraz Restaurant": {
            "Locations": [
                "770 Middle Neck Rd, Great Neck"
            ]
        }},
        {"Shiraz Kitchen": {
            "Locations": [
                "83 E Main St, Elmsford, NY"
            ]
        }},
        {"Chatanooga Persian": {
            "Locations": [
                "37 Cutter Mill Rd, Great Neck"
                ]
        }},
        {"Bijan's": {
            "Locations": [
                "81 Hoyt St, Brooklyn"
            ]
        }}
    ]},
    {"Iraq": [
        {"Moustache": {
            "Locations": [
                "90 Bedford St, Manhattan",
                "265 E 10th St, Manhattan",
                "1621 Lexington Ave, Manhattan"
            ]
        }}
    ]},
    {"Yemen": [
        {"Yemen Cafe": {
            "Locations": [
                "176 Atlantic Ave, Brooklyn",
                 "7130 5th Ave, Brooklyn"
            ]
        }},
        {"Yemen Cuisine": {
            "Locations": [
                "145 Court St, Brooklyn"
            ]
        }},
        {"Hadramout": {
            "Locations": [
                "172 Atlantic Ave, Brooklyn"
            ]
        }},
        {"Maya Cuisine": {
            "Locations": [
                "24-42 Steinway Street, Astoria"
            ]
        }},
        {"Grill 212": {
            "Locations": [
                "212 W 80th St, Manhattan"
            ]
        }}
    ]},
    {"Somalia": [
        {"Safari Restaurant": {
            "Locations": [
                "219 W 116th St, Manhattan"
            ]
        }}
    ]},
    {"Syria": [
        {"Al Salam Restaurant": {
            "Locations": [
                "7206 5th Ave, Brooklyn"
            ]
        }},
        {"Balady Foods": {
            "Locations": [
                "7128 5th Ave, Brooklyn"
            ]
        }},
        {"Damascus Bakery": {
            "Locations": [
                "195 Atlantic Ave, Brooklyn"
            ]
        }},
        {"Cafe Rakka": {
            "Locations": [
                "81 St. Marks Pl, Manhattan"
            ]
        }},
        {"Aleppo": {
            "Locations": [
                "939 Main St, Paterson, NJ"
            ]
        }},
        {"Mansoura": {
            "Locations": [
                "515 Kings Hwy, Brooklyn"
            ]
        }},
        {"First Oasis": {
            "Locations": [
                "9218 4th Ave, Brooklyn"
            ]
        }},
        {"Mar Mar": {
            "Locations": [
                "370 Forest Ave, Staten Island"
            ]
        }},
        {"Syrian Sweet Refuge": {
            "Locations": [
                "Multiple Locations"
            ]
        }}
    ]}
];


//string name of chosen country
var chosenCountry;

//array of restaurants from specific country
var restaurantArray;

//dictionary for chosen restaurant
var chosenRestaurant;

//string name of chosen restaurant
var restaurantName;

// These are messages that Alexa says to the user during conversation

// This is the initial welcome message
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
        //Get country
        var countryIndex = Math.floor(Math.random() * countriesArray.length);
        var randomCountryDict = countriesArray[countryIndex];

        //Have Country Dictionary
        //get array of country restaurants
        for (var countryKey in randomCountryDict) {
            restaurantArray = randomCountryDict[countryKey];
            chosenCountry = countryKey;
        }

        //Get random restaurant from array
        var restaurantIndex = Math.floor(Math.random() * restaurantArray.length);
        var chosenRestaurantDict =  restaurantArray[restaurantIndex];

        //get restaurant name(dictionary key)
        for (var restaurantKey in chosenRestaurantDict) {
            restaurantName = restaurantKey;
        }
        var restaurantLocation = chosenRestaurantDict[restaurantName]["Locations"][0];

        var speechOutput = "Your restaurant is " + restaurantName + ". " + "It is located at " + restaurantLocation;
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