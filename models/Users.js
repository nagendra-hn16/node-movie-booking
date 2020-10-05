const mongoose  = require('mongoose');

const UserSchema  = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        default: 'user'
    },
    availabilityStatus: {
        type: String,
        default: 'available'
    },
    reservations: {
        type: Array
    }
})

module.exports = mongoose.model('Users', UserSchema);