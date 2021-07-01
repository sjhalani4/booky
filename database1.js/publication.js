const mongoose = require("mongoose");

// Creating a book schema
const PublicationSchema = mongoose.Schema({
id: Number,
name: String,
books: [String],
});

// Create a book model
const PublicationModel = mongoose.model("publication",PublicationSchema);

module.exports = PublicationModel;