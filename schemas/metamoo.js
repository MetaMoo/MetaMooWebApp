//Schema exports a mongoose model
// we are pulling in mongoose directly - not pulling in a live db connection
// this file exports a mongoose model

var mongoose = require('mongoose'); //exports models
var User = require('../schemas/user');


module.exports = mongoose.model('Snippet',{
	content: String,
	tag: String,
	note: String,
	source: String,
	date: String,
	email: String
});