// Dependencies
var express = require("express");
var router = express.Router();
var path = require("path");

// Our scraping tools
// Axios is a promise-based http library
var request = require("request");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Load index page
router.get("/", function (req, res) {
    res.redirect("/articles");
});


module.exports = router;