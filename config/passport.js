//configure passport.js. THis file has the login/singup
// strategy. 

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../schemas/user');

// expose this function to our app using module.exports
module.exports = function(passport){

	// Passport Session setup - reqd for persistent sessions

	//to serialize the user for the session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	//used to deserialize the user
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	//LOCAL SIGNUP

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done){

		//asynchronous
		//User.findOne wont fire unless data is sent back
		process.nextTick(function(){
			User.findOne({ 'local.email' : email}, function(err, user){
				if (err)
					return done(err);

				if(user){
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user

					var newUser = new User();

					// set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					// save the user
					newUser.save(function(err){
						if (err)
							throw err;
						return done(null, newUser);
					});

				}
			});

		});
	}));


	//LOCAL LOGIN

	passport.use('local-login', new LocalStrategy({
		usernameField	: 'email',
		passwordField 	: 'password',
		passReqToCallback : true
	},
	function(req, email, password, done){
		// find a user whose email is the same as that in the form
		// we are checking if user trying to login already exists

		User.findOne({ 'local.email' : email}, function(err, user){
			if (err)
				return done(err);
			// if no user is found return a message
			if(!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			// if user is found but password is wrong
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage','Oops! Wrong password.'));
			
			// all is well, return successful user
			return done(null, user);

		});

	}));
};
