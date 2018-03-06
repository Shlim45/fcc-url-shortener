const mongoose = require('mongoose');

const ShortenedShema = new mongoose.Schema({
    url: String,
    id: Number
});

module.exports = mongoose.model("Shortened", ShortenedShema);