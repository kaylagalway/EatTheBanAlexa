'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).


var countriesArray = [
    {"Iran": {
        "Ravagh Persian Grill": {
            "Locations": [
                "11 E 30th St, Manhattan", 
                "1135 1st Ave, Manhattan", 
                "125 1st Ave, Manhattan"
            ]
        },
        "Taste of Persia": {
            "Locations": [
                "12 W 18th St, Manhattan" 
            ]
        },
        "Pars Grill House": {
            "Locations": [
                "249 W 26th St, Manhattan"
            ]
        },
        "Colbeh": {
            "Locations": [
                "75 N Station Plaza, Great Neck"
            ]
        },
        "Persepolis": {
            "Locations": [
                "1407 2nd Ave, Manhattan"
            ]
        },
        "Patoug Persian Cuisine": {
            "Locations": [
                "220-06 Horace Harding Expy, Queens"
            ]
        },
        "Shiraz Restaurant": {
            "Locations": [
                "770 Middle Neck Rd, Great Neck"
            ]
        },
        "Shiraz Kitchen": {
            "Locations": [
                "83 E Main St, Elmsford, NY"
            ]
        },
        "Chatanooga Persian": {
            "Locations": [
                "37 Cutter Mill Rd, Great Neck"
                ]
        },
        "Bijan's": {
            "Locations": [
                "81 Hoyt St, Brooklyn"
            ]
        }
    }},
    {"Iraq": {
        "Moustache": {
            "Locations": [
                "90 Bedford St, Manhattan",
                "265 E 10th St, Manhattan",
                "1621 Lexington Ave, Manhattan"
            ]
        }
    }},
    {"Yemen": {
        "Yemen Cafe": {
            "Locations": [
                "176 Atlantic Ave, Brooklyn",
                 "7130 5th Ave, Brooklyn"
            ]
        },
        "Yemen Cuisine": {
            "Locations": [
                "145 Court St, Brooklyn"
            ]
        },
        "Hadramout": {
            "Locations": [
                "172 Atlantic Ave, Brooklyn"
            ]
        },
        "Maya Cuisine": {
            "Locations": [
                "24-42 Steinway Street, Astoria"
            ]
        },
        "Grill 212": {
            "Locations": [
                "212 W 80th St, Manhattan"
            ]
        }
    }},
    {"Somalia": {
        "Safari Restaurant": {
            "Locations": [
                "219 W 116th St, Manhattan"
            ]
        }
    }},
    {"Syria": {
        "Al Salam Restaurant": {
            "Locations": [
                "7206 5th Ave, Brooklyn"
            ]
        },
        "Balady Foods": {
            "Locations": [
                "7128 5th Ave, Brooklyn"
            ]
        },
        "Damascus Bakery": {
            "Locations": [
                "195 Atlantic Ave, Brooklyn"
            ]
        },
        "Cafe Rakka": {
            "Locations": [
                "81 St. Marks Pl, Manhattan"
            ]
        },
        "Aleppo": {
            "Locations": [
                "939 Main St, Paterson, NJ"
            ]
        },
        "Mansoura": {
            "Locations": [
                "515 Kings Hwy, Brooklyn"
            ]
        },
        "First Oasis": {
            "Locations": [
                "9218 4th Ave, Brooklyn"
            ]
        },
        "Mar Mar": {
            "Locations": [
                "370 Forest Ave, Staten Island"
            ]
        },
        "Syrian Sweet Refuge": {
            "Locations": [
                "Multiple Locations"
            ]
        }
    }}
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

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'SuggestionIntent': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        //var countryArr = this.t('FACTS');
        var countryIndex = Math.floor(Math.random() * countriesArray.length);
        var randomCountryArray = countriesArray[countryIndex];
        var restaurantIndex = Math.floor(Math.random() * randomCountryArray.length);
        chosenRestaurant =  randomCountryArray[restaurantIndex]

        // Create speech output
        var speechOutput = "You're restaurant is" + chosenRestaurant
        this.emit(":tell", speechOutput)
        // "," + "Do you want more information?"
        //this.handler.state = states.ASKMODE
        //this.emit(':ask', speechOutput)
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});

// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again



// var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

//     'SuggestionIntent': function () {
//         // Handle Yes intent.
//         helper.yesOrNo(this,'yes');
//     },
//     'LocationIntent' : function () {

//     },
//     'AMAZON.HelpIntent': function () {
//         this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
//     },
//     'AMAZON.StopIntent': function () {
//         this.emit(':tell', goodbyeMessage);
//     },
//     'AMAZON.CancelIntent': function () {
//         this.emit(':tell', goodbyeMessage);
//     },
//     'AMAZON.StartOverIntent': function () {
//         // reset the game state to start mode
//         this.handler.state = states.STARTMODE;
//         this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
//     },
//     'Unhandled': function () {
//         this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
//     }
// });

};