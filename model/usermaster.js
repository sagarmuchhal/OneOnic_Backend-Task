const mongoose = require('mongoose');

const usermaster = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});

module.exports = mongoose.model('UserMaster', usermaster);