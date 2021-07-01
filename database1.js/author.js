const mongoose = require("mongoose");

// Creating a book schema
const AuthorSchema = mongoose.Schema({
id: Number,
name: String,
books: [String],
});

// Create a book model
const Authormodel = mongoose.model("Authors",AuthorSchema);

module.exports = Authormodel;