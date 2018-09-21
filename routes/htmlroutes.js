var db = require("../models");
var path = require("path");

module.exports = function(app) {

    // Load index page
    app.get("/index", function(req, res) {
        res.render("/");
    });
};
