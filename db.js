const mongoose = require('mongoose');

const protocol = 'mongodb';
const host = 'localhost:27017';
const mongoUrl = `${protocol}://${host}`;

const options = { dbName: 'finalproject' };

function connect() {
    mongoose.connect(mongoUrl, options);
}

function disconnect() {
    mongoose.connection.close();
}

module.exports = { connect, disconnect };
