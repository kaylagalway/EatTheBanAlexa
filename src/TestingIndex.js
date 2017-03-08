'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.045843cb-12ef-4af0-8371-3a650b6c5131";  // TODO replace with your app ID (OPTIONAL).

var states = {
    STARTMODE: '_STARTMODE', 
    BROWSEMODE: '_BROWSEMODE',               
    ASKMODE: '_ASKMODE',                    
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     
};


var allRestaurants = { 
	"countries": [

		{"name": "Iran",
		"restaurants": [
			{"name": "Ravagh Persian Grill",
			"locations": [
				"11 E 30th St, Manhattan", 
				"1135 1st Ave, Manhattan", 
				"125 1st Ave, Manhattan"
    		]},
    		{"name": "Taste of Persia",
    		"locations": [
    			"12 W 18th St, Manhattan"
    		]},
    		{"name": "Pars Grill House",
    		"locations": [
    			"249 W 26th St, Manhattan"
    		]},
    		{"name": "Colbeh",
    		"locations": [
    			"75 N Station Plaza, Great Neck"
    		]},
    		{"name": "Persepolis",
    		"locations": [
    			"1407 2nd Ave, Manhattan"
    		]},
    		{"name": "Patoug Persian Cuisine",
    		"locations": [
    			"220-06 Horace Harding Expy, Queens"
    		]},
    		{"name": "Shiraz Restaurant",
    		"locations": [
    			"220-06 Horace Harding Expy, Queens"
    		]},
    		{"name": "Shiraz Kitchen",
    		"locations": [
    			"83 E Main St, Elmsford, NY"
    		]},
    		{"name": "Chatanooga Persian",
    		"locations": [
    			"37 Cutter Mill Rd, Great Neck"
    		]},
    		{"name": "Bijan's",
    		"locations": [
    			"81 Hoyt St, Brooklyn"
    		]}
    	]},

    	{"name": "Iraq",
    	"restaurants": [{
    		"name": "Moustache",
    		"locations": [
    			"90 Bedford St, Manhattan",
    			"265 E 10th St, Manhattan",
    			"1621 Lexington Ave, Manhattan"
    		]}
    	]},

    	{"name": "Yemen",
    	"restaurants": [{
    		"name": "Yemen Cafe",
    		"locations": [
    		     "176 Atlantic Ave, Brooklyn",
                 "7130 5th Ave, Brooklyn"
    		]},
    		{"name": "Yemen Cuisine",
    		"locations": [
    		     "145 Court St, Brooklyn"
    		]},
    		{"name": "Hadramout",
    		"locations": [
    		     "172 Atlantic Ave, Brooklyn"
    		]},
    		{"name": "Maya Cuisine",
    		"locations": [
    		     "24-42 Steinway Street, Astoria"
    		]},
    		{"name": "Grill 212",
    		"locations": [
    		     "212 W 80th St, Manhattan"
    		]}
    	]},

    	{"name": "Somalia",
    	"restaurants": [{
    		"name": "Safari Restaurant",
    		"locations": [
    			"219 W 116th St, Manhattan"
    		]}
    	]},

    	{"name": "Syria",
		"restaurants": [
			{"name": "Al Salam Restaurant",
			"locations": [
				"7206 5th Ave, Brooklyn", 
    		]},
    		{"name": "Balady Foods",
    		"locations": [
    			"7128 5th Ave, Brooklyn"
    		]},
    		{"name": "Damascus Bakery",
    		"locations": [
    			"195 Atlantic Ave, Brooklyn"
    		]},
    		{"name": "Cafe Rakka",
    		"locations": [
    			"81 St. Marks Pl, Manhattan"
    		]},
    		{"name": "Aleppo",
    		"locations": [
    			"939 Main St, Paterson, NJ"
    		]},
    		{"name": "Mansoura",
    		"locations": [
    			"515 Kings Hwy, Brooklyn"
    		]},
    		{"name": "First Oasis",
    		"locations": [
    			"9218 4th Ave, Brooklyn"
    		]},
    		{"name": "Mar Mar",
    		"locations": [
    			"370 Forest Ave, Staten Island"
    		]},
    		{"name": "Syrian Sweet Refuge",
    		"locations": [
    			"Multiple Locations"
    		]}
    	]}
	]
};

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

var browseByCountryMessage = "Would you like to browse Iran, Iraq, or more?";
var browseByCountryMessageTwo = "How about Syria, Somalia, or Yemen?";

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

var countryNameDict = {
	"Iran" : 0,
	"Iraq" : 1,
	"Yemen": 2,
	"Somalia": 3,
	"Syria": 4
};

// --------------- Handlers -----------------------

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startHandlers, browseHandlers);
    alexa.execute();
};

//set the state to Start and welcome user
var newSessionHandlers = {
    'LaunchRequest': function() {
        this.handler.state = states.STARTMODE;
        this.emit(":ask", welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
};

// --------------- Functions that control the skill's behavior -----------------------

//Beginning of the restaurant request process
var startHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'SuggestionIntent': function () {
        helper.giveRandomSuggestion(this);
    },
    'BrowseIntent': function () {
    	this.handler.state = states.BROWSEMODE;
    	this.emit(':ask', browseByCountryMessage, browseByCountryMessage);
    },
    'AMAZON.YesIntent': function () {
        helper.giveRandomSuggestion(this);
    },
    'AMAZON.NoIntent': function () {

    }
});

var browseHandlers = Alexa.CreateStateHandler(states.BROWSEMODE, {
	'IranIntent': function() {
		helper.browseByCountry(this, "Iran");
	},
	'IraqIntent': function() {
		helper.browseByCountry(this, "Iraq");
	},
	'SomaliaIntent': function() {
		helper.browseByCountry(this, "Somalia");
	},
	'SyriaIntent': function() {
		helper.browseByCountry(this, "Syria");
	},
	'YemenIntent': function() {
		helper.browseByCountry(this, "Yemen");
	},
	'MoreIntent': function() {
		this.emit(':ask', browseByCountryMessageTwo, browseByCountryMessageTwo);
	}
});

// --------------- Helper Functions  -----------------------

var helper = {
    giveRandomSuggestion: function (context) {
        //need to add check to make sure not the same as previous suggestion

        //Get country
        var countriesArray = allRestaurants.countries;
        var countryIndex = Math.floor(Math.random() * countriesArray.length);
        var randomCountryDict = countriesArray[countryIndex];

        //Get Restaurant
        var restaurantsArray = randomCountryDict.restaurants;
        var restaurantIndex = Math.floor(Math.random() * restaurantsArray.length);
        var restaurant = restaurantsArray[restaurantIndex];

        var speechOutput = "Your restaurant is " + restaurant.name + "from the country " + randomCountryDict.name + ". " + "It is located at " + restaurant.locations[0] + ". Would you like a different suggestion?";
        context.emit(":ask", speechOutput, speechOutput);
    },
    browseByCountry: function (context, country) {
    	//need to add check to make sure not the same as previous suggestion

    	//retrieves index value from country name dict based on country string parameter
    	var countryIndex = countryNameDict[country];

    	//all restaurants is dictionary
    	//.countries is key to countries array
    	var countriesArray = allRestaurants.countries;

    	//country index is dictionary to specific country
    	var countryDict = countriesArray[countryIndex];

    	//.restaurants is array of restaurant dictionaries
    	var restaurantsArray = countryDict.restaurants;

    	//creates random number for index of restaurant
    	var restaurantIndex = Math.floor(Math.random() * restaurantsArray.length);

    	//restaurant in restaurantsArray
    	var restaurant = restaurantsArray[restaurantIndex];

    	//.name is key to restaurant dictionary
    	var restaurantName = restaurant.name;

    	var speechOutput = restaurantName;

        //var speechOutput = "Your restaurant is " + restaurant.name + "from the country " + country + ". " + "It is located at " + restaurant.locations[0] + ". Would you like a different suggestion?";
        context.emit(":ask", speechOutput, speechOutput);
    }


};