var mongoose = require('mongoose'); //exports models

module.exports = mongoose.model('Snippet',{
	content: String,
	tag: String,
	note: String,
	source: String,
	date: String
})