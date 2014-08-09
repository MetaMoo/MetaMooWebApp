var mongoose = require('mongoose');

mongoose.connect('mongodb://metamoo:cowplaneburgerrain@dbh16.mongolab.com:27167/metamoo');

module.exports = mongoose.connection;

