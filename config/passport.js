//configure passport.js. THis file has the login/singup
// strategy. 

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../schemas/user');

// load auth variables
var configAuth = require('./auth');

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

	// =========================================================
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


	// ===========================================================
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



	// =========================================
	// TWITTER login

	passport.use(new TwitterStrategy({

		consumerKey		: configAuth.twitterAuth.consumerKey,
		consumerSecret	: configAuth.twitterAuth.consumerSecret,
		callbackURL		: configAuth.twitterAuth.callbackURL,
		passReqToCallback : true //allows us to pass in the req form from our root, lets us check if user is logged in or not

	},
	function(req, token, tokenSecret, profile, done){

		// asynchronous
		process.nextTick(function(){

			// check if the user is already logged in
			if (!req.user) {

				// find user in the db based on their twitter id.
				User.findOne({ 'twitter.id' : profile.id}, function(err, user){
				// make the code asynchronous
				// user.findone won't fire until we have all the data back from Twitter

					// if any error, stop everything and return error
					if (err)
						return done(err);

					//if the user is found then log them in
					if (user) {

						// if there is a user id already but no token (user was linked at one point and then removed)
						// just add our token and profile info

						if (!user.twitter.token){
							user.twitter.token = token;
							user.twitter.username = profile.username;
							user.twitter.displayName = profile.displayName;

							user.save(function(err){
								if (err)
									throw err;
								return done(null, user);
							});
						};

						return done (null, user);
					} else {
						//if there is no user create them
						var newUser					= new User();

						//set all of the user data that we need
						newUser.twitter.id			= profile.id;
						newUser.twitter.token 		= token;
						newUser.twitter.username 	= profile.username;
						newUser.twitter.displayName	= profile.displayName;

						// save our user into the database
						newUser.save(function(err){
							if (err)
								throw err;
							return done(null, newUser);
						});
					};
				});
			} else {
				//user already exists and is logged in, we have to link accounts
				var user 					= req.user; //pull user out of session

				// update the current users twitter credentials
				user.twitter.id 			= profile.id;
				user.twitter.token 			= token;
				user.twitter.username 		= profile.username;
				user.twitter.displayName 	= profile.displayName;

				//save the user
				user.save(function(err){
					if (err)
						throw err;
					return done(null, user);
				});

			};
		});

	}));


	// =========================================================================
   // GOOGLE 
  
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true //allows us to pass in the req form from our root, lets us check if user is logged in or not

    },
    function(req, token, refreshToken, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {

			// check if the user is already logged in
			if(!req.user) {

		       // try to find the user based on their google id
		        User.findOne({ 'google.id' : profile.id }, function(err, user) {
		            if (err)
		                return done(err);

		            if (user) {


						// if there is a user id already but no token (user was linked at one point and then removed)
						// just add our token and profile info

						if (!user.google.token){
							user.google.token = token;
							user.google.name = profile.displayName;
							user.google.email = profile.email;

							user.save(function(err){
								if (err)
									throw err;
								return done(null, user);
							});
						};


		               // if a user is found, log them in
		                return done(null, user);
		            } else {
		               // if the user isnt in our database, create a new user
		                var newUser          = new User();

		               // set all of the relevant information
		                newUser.google.id    = profile.id;
		                newUser.google.token = token;
		                newUser.google.name  = profile.displayName;
		                newUser.google.email = profile.emails[0].value; // pull the first email

		               // save the user
		                newUser.save(function(err) {
		                    if (err)
		                        throw err;
		                    return done(null, newUser);
		                });
		            };
		        });
		    } else {
		    	//user already exists and is logged in, we have to link accounts
				var user 					= req.user; //pull user out of session

				// update the current users twitter credentials
				user.google.id 			= profile.id;
				user.google.token 			= token;
				user.google.name 		= profile.displayName;
				user.google.email 	= profile.emails[0].value;

				//save the user
				user.save(function(err){
					if (err)
						throw err;
					return done(null, user);
				});
		    };
	    });

    }));
};
