var mongoose = require('mongoose'); //exports models
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local			: {
		email		: String,
		password 	: String
	},
	twitter			: {
		id			: String,
		token		: String,
		displayName	: String,
		username 	: String
	},
	google			: {
		id			: String,
		token		: String,
		email		: String,
		name 		: String
	}

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);