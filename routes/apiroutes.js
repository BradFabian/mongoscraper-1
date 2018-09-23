// Dependencies
var express = require("express");
var router = express.Router();

// Our scraping tools
// Axios is a promise-based http library
var request = require("request");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");

// Require all models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js")

// GET route for scraping The Verge's Tech page
router.get("/scrape", function (req, res) {
    // First we grab the body of the html with axios
    request("https://www.theverge.com/tech", function (error, response, html) {
        // Load the body of the HTML into cheerio
        var $ = cheerio.load(html);

        // With cheerio, find each h2-tag with the class "c-entry-box--compact__title" and loop through the results
        $("h2.c-entry-box--compact__title").each(function (i, element) {
            // Save an empty result object
            var result = {};
            var articleArray = [];

            // Add the text & href of each link and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            // Makes sure that no empty title or links are sent to mongodb
            if (result.title !== "" && result.link !== "") {

                // Push the saved title to the articleArray
                articleArray.push(result.title);

                // Add new article if it's not displaying
                Article.count({ title: result.title }, function(err, res) {

                    // Create a new object with the Article model
                    var entry = new Article(result);

                    // Save new object to MongoDB
                    entry.save(function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(data);
                        }
                    });
                });
            };
        });
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.redirect("/");
    });
});

// Route for getting all the Articles from the db
router.get("/", function (req, res) {
    // Find all articles 
    Article.find().sort({ _id: -1 })
        // If all articles are successfully found then send to handlebars
        // Limit to 30 articles
        .limit(30)
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                var hbsObject = {
                    article: data
                };
                res.render("index", hbsObject);
            }
        });
});

// Grab articles that were scraped from MongoDB to JSON format
router.get('/articles-json', function(req, res) {
    Article.find({}, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(data);
        }
    });
});


// Route for grabbing a specific article by ID and populate it with its note
router.get("/articles/:id", function (req, res) {
    // Route finds one article using the req.params.id
    Article.findOne({ _id: req.params.id })
        // And run the populate method with "note"
        .populate("note")
        // Then respond with article (note included)
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        // If an error occurs, catch it and send it back to the client
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving and updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    // Save the new note that gets posted to the Notes collection
    Note.create(req.body)
        .then(function (dbNote) {
            // Find an article from the req.params.id and update its "note" property with the _id of the new note
            return Article.findOneandUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


module.exports = router;
