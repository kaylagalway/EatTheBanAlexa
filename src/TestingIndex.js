'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.045843cb-12ef-4af0-8371-3a650b6c5131";  // TODO replace with your app ID (OPTIONAL).

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


var allRestaurants = { 
	"countries": [{
		"name": "Iran",
		"restaurants": [{
			"name": "Ravagh Persian Grill",
			"locations": [
				"11 E 30th St, Manhattan", 
				"1135 1st Ave, Manhattan", 
				"125 1st Ave, Manhattan"
    		]},
    		{"name": "Taste of Persia",
    		"locations": [
    			"12 W 18th St, Manhattan"
    		]}
		]}
	]
}

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
    alexa.registerHandlers(newSessionHandlers, startHandlers);
    alexa.execute();
};

//set the state to Start and welcome user
var newSessionHandlers = {
    'LaunchRequest': function() {
        this.handler.state = states.STARTMODE
        this.emit(":ask", welcomeMessage, repeatWelcomeMessage)
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
}

// --------------- Functions that control the skill's behavior -----------------------

//Beginning of the restaurant request process
var startHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'SuggestionIntent': function () {
        helper.giveRandomSuggestion(this);
    },
    'AMAZON.YesIntent': function () {
        helper.giveRandomSuggestion(this);
    },
    'AMAZON.NoIntent': function () {

    }
});

// --------------- Helper Functions  -----------------------

var helper = {
    giveRandomSuggestion: function (context) {
        //need to add check to make sure not the same as previous suggestion

        //Get country
        var countryIndex = Math.floor(Math.random() * allRestaurants.length);
        var randomCountryDict = allRestaurants[countryIndex];
        var restaurants = randomCountryDict["restaurants"];
        var resturantIndex = Math.floor(Math.random() * restaurants.length);
        var restaurant = restaurants[restaurantIndex];
        var speechOutput = "Your restaurant is " + restaurant["name"] + ". " + "It is located at " + restaurant["locations"].first() + ". Would you like a different suggestion?";
        context.emit(":ask", speechOutput, speechOutput);
    }
};