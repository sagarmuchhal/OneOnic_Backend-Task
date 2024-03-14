const mongoose = require('mongoose');

async function dbConnection() {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/sagar');
        console.log('App is Connected with MongoDB Database...');
        return mongoose.connections;
    } catch (error) {
        console.log(error);
        console.log('Error in DB Connection..');
    }
}

module.exports = { dbConnection };