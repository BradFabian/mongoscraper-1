// Dependencies
var express = require("express");
var exphbs  = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// Makes a request to The Verge's Tech page
request("https://www.theverge.com/tech", function(error, response, html) {

    // Load the body of the HTML into cheerio
    var $ = cheerio.load(html);

    // Empty array to save our scraped data
    var results = [];

    // With cheerio, find each h3-tag with the class "graf" and loop through the results
    $("h2.c-entry-box--compact__title").each(function(i, element) {

        // Save the text of the h3-tag as "title"
        var title = $(element).children().text();

        // Find the h3 tag's parent a-tag and save its href value as "link"
        var link = $(element).children().attr("href");

        // Make an object with data we scraped for this h3 and push it to the results array
        results.push({
            title: title,
            link: link
        });
    });

    console.log(results);
});


/* // Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Middleware

// Use morgan logger for logging the requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// Start the server
app.listen(PORT, function() {
    console.log("App running on port" + PORT + "!");
}); */