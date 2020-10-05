const mongoose  = require('mongoose');

const LocationSchema = mongoose.Schema({
    locations: Array
})

module.exports = mongoose.model('Locations', LocationSchema);