// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require('method-override');

var PORT = 3000;

// Initialize Express app
var app = express();

// Setting up Morgan middleware
app.use(logger("dev"));

// Setting up Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// Setting up Handlebars middleware
app.engine("handlebars", exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Setting up static directory
app.use(express.static("public"));

// ROUTES
app.use(require('./routes/apiroutes'));
app.use(require('./routes/htmlroutes'));

// Connect to the database and setting it up
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoVerge";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});

