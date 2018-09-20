// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promise-based http library
var axios = require("axios");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express app
var app = express();

// Setting up Morgan middleware
app.use(logger("dev"));

// Setting up Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up Handlebars middleware
app.engine("handlebars", exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Setting up static directory
app.use(express.static("public"));

// Connect to the database and setting it up
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoVerge";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// ROUTES

// GET route for scraping The Verge's Tech page
app.get("/scrape", function(req, res) {

    // First we grab the body of the html with axios
    axios.get("https://www.theverge.com/tech").then(function(response) {

        // Load the body of the HTML into cheerio
        var $ = cheerio.load(response.data);

        // With cheerio, find each h2-tag with the class "c-entry-box--compact__title" and loop through the results
        $("h2.c-entry-box--compact__title").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text & href of each link and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            
            // Create a new Article using the 'result' object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // if we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape complete!");
    });
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  