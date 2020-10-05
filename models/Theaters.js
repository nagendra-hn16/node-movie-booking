const mongoose = require('mongoose');

const TheatersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    movieDetails: {
        type: Array
    }
})

module.exports = mongoose.model('Theaters', TheatersSchema);