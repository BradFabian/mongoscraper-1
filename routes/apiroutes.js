var db = require("../models");

// Our scraping tools
// Axios is a promise-based http library
var axios = require("axios");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");

module.exports = function (app) {
    // GET route for scraping The Verge's Tech page
    app.get("/scrape", function (req, res) {
        // First we grab the body of the html with axios
        axios.get("https://www.theverge.com/tech").then(function (response) {
            // Load the body of the HTML into cheerio
            var $ = cheerio.load(response.data);

            // With cheerio, find each h2-tag with the class "c-entry-box--compact__title" and loop through the results
            $("h2.c-entry-box--compact__title").each(function (i, element) {
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
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
            });

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape complete!");
        });
    });

    // Route for getting all the Articles from the db
    app.get("/articles", function (req, res) {
        // Find all articles 
        db.Article.find({})
            // If all articles are succesfully found then send them back to the client
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            // If there is an error, catch it and send it back to the client
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for grabbing a specific article by ID and populate it with its note
    app.get("/articles/:id", function (req, res) {
        // Route finds one article using the req.params.id
        db.Article.findOne({ _id: req.params.id })
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
    app.post("/articles/:id", function (req, res) {
        // Save the new note that gets posted to the Notes collection
        db.Note.create(req.body)
            .then(function (dbNote) {
                // Find an article from the req.params.id and update its "note" property with the _id of the new note
                return db.Article.findOneandUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
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

}