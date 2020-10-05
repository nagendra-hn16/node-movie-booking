const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    screenType: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        default: 'unrated'
    },
    imageSrc: {
        type: String
    },
    locations: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Movies', movieSchema);