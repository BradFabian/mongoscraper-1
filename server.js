// Dependencies
var express = require("express");
var exphbs  = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");