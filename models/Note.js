var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new NoteSchema object using the Schema constructor
var NoteSchema = new Schema({
    // 'title' is of type String
    title: String,
    // 'body' is of type String
    body: String
});

// This creates our model from the NoteSchema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;