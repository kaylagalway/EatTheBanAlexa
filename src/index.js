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
        var randomCountryArray = countriesArray[countryIndex];
        var restaurantIndex = Math.floor(Math.random() * randomCountryArray.length);
        chosenRestaurant =  randomCountryArray[restaurantIndex]
        var speechOutput = "You're restaurant is" + chosenRestaurant
        this.emit(":tell", speechOutput)
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