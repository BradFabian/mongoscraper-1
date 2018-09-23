var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create an ArticleSchema object using the Schema constructor
var ArticleSchema = new Schema({
    // 'title' is required and of type String
    title: {
        type: String,
        required: true
    },
    // 'link' is required and of type String
    link: {
        type: String,
        required: true
    },
    // 'note' is an object that stores a Note id
    // The ref property links the ObjectId to the Note model, which allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This created our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);
ArticleSchema.plugin(uniqueValidator);

// Export the Article model
module.exports = Article;