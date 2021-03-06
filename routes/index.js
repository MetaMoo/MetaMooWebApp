var express = require('express');
var router = express.Router();
var passport = require('passport');
//var appdata = require('../metamoo_data.json');

//MetamooSchema object is a chainable object that we can use to build a query
var MetamooSchema = require('../schemas/metamoo'); 
//var Account = require('../schemas/account');

//=============================================================
// NORMAL ROUTES
//=============================================================

// ---------------------------------------------
// Show home page (i.e., page with login links)
// ---------------------------------------------
/* GET home page. */
router.get('/', function(req, res) {
  	res.render('home',{ message: req.flash('loginMessage') });
  	//res.render('index', {user : req.user});
});


// ---------------------------------------------
// Show Search results page
// ---------------------------------------------
/* GET search results page. 
You get to this page from typing in something
in the search bar and then hitting enter (see jQuery script in /javascripts/main.js*/ 
router.get('/searching', function(req, res) {
	var val = req.query.search;
	var authEmail = req.user.local.email;
	MetamooSchema.find({ tag: {$regex : val, $options : 'i'}, email: authEmail }).exec(function (err, docs) { 
		if (err) throw err; 
		data = docs; 
		res.send(data);
	});	
});

// ---------------------------------------------
// Show Logout page
// ---------------------------------------------
router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

// ---------------------------------------------
// Show MAIN profile page (i.e., index page with search bar and logo)
// ---------------------------------------------
/* GET Main search page. */
router.get('/profile', isLoggedIn, function(req, res) {
  	res.render('index', {user : req.user});
});

// ---------------------------------------------
// Show Notepad page
// ---------------------------------------------
router.get('/notepad', isLoggedIn, function(req, res) {
  	res.render('notepad', {user : req.user});
});

// ---------------------------------------------
// Show About page
// ---------------------------------------------
router.get('/about', function(req, res) {
  	res.render('about', {user : req.user});
  	//res.render('index', {user : req.user});
});

// ---------------------------------------------
// Show How it Works page
// ---------------------------------------------
router.get('/howitworks', function(req, res) {
  	res.render('howitworks');
  	//res.render('index', {user : req.user});
});

// ---------------------------------------------
// Show Terms of service page
// ---------------------------------------------
router.get('/termsofservice', function(req, res) {
  	res.render('termsofservice', {user : req.user});
  	//res.render('index', {user : req.user});
});

// ---------------------------------------------
// Show Privacy Policy page
// ---------------------------------------------
router.get('/privacypolicy', function(req, res) {
  	res.render('privacypolicy', {user : req.user});
  	//res.render('index', {user : req.user});
});

// ---------------------------------------------
// Landing page if you are already logged in
// ---------------------------------------------
router.get('/homeLoggedIn', isLoggedIn, function(req, res) {
  	res.render('homeLoggedIn',{ message: req.flash('loginMessage') });
  	//res.render('index', {user : req.user});
});


// ---------------------------------------------
// Post Sign up Welcome page - Two step to download plugin + tutorials
// ---------------------------------------------
router.get('/thankyou', isLoggedIn, function(req, res) {
  	res.render('thankyou', {user : req.user});
});

// ---------------------------------------------
// Getting started page - Installing chrome plugin etc.
// ---------------------------------------------
router.get('/gettingstarted', isLoggedIn, function(req, res) {
  	res.render('gettingstarted', {user : req.user});
});

// ---------------------------------------------
// Tutorial Step 1 - Welcome page
// ---------------------------------------------
router.get('/tutorialstep1', isLoggedIn, function(req, res) {
  	res.render('tutorialstep1', {user : req.user});
});

// ---------------------------------------------
// Tutorial Step 2 - First set of random sentences
// ---------------------------------------------
router.get('/tutorialstep2', isLoggedIn, function(req, res) {
  	res.render('tutorialstep2', {user : req.user});
});

// ---------------------------------------------
// Tutorial Step 3 - Second set of random sentences
// ---------------------------------------------
router.get('/tutorialstep3', isLoggedIn, function(req, res) {
  	res.render('tutorialstep3', {user : req.user});
});

// ---------------------------------------------
// Tutorial Graduation 
// ---------------------------------------------
router.get('/graduated', isLoggedIn, function(req, res) {
  	res.render('graduated', {user : req.user});
});


// ---------------------------------------------
// Google verification for chrome plugin inline install
// ---------------------------------------------
router.get('/google5fb9705d1f3fcf75.html', function(req, res) {
  	res.render('googleverification');
  	//res.render('index', {user : req.user});
});

// ---------------------------------------------
// Help page
// ---------------------------------------------
router.get('/help', function(req, res) {
  	res.render('help', {user : req.user});
  	//res.render('index', {user : req.user});
});

// ---------------------------------------------
// Show Tags in side panel
// ---------------------------------------------
/* GET all tags page. 
You can see all tags by selecting button to reveal
side panel (see jQuery script in /javascripts/main.js*/ 
router.get('/alltags', function(req, res) {
	var authEmail = req.user.local.email;
	MetamooSchema.find({ email: authEmail }).exec(function (err, docs) { 
		if (err) throw err; 
		data = docs; 
		res.send(data);
	});	
});

// ---------------------------------------------
// Route to post data into database
// ---------------------------------------------
router.post('/snippet', isLoggedIn, function(req, res){
// So Chromeplugin or any other data source can push data
// Need to figure out how to handle req. sent as a json.
// push to db

	var snippetInput = req.body;
	snippetInput.email = req.user.local.email;
	MetamooSchema.create(snippetInput, function(err, snippet){
	if (err) return console.log(err);
	return res.send("Saved");
});
});
// ---------------------------------------------
// Route to update data in database
// ---------------------------------------------
router.post('/update', isLoggedIn, function(req, res){

	var updateInput = req.body;
	//updateInput.email = req.user.local.email;
	console.log(updateInput._id);
	MetamooSchema.update({ _id: updateInput._id },{$set: {tag: updateInput.tag,note: updateInput.note}},function(err, result){
	if (err) return console.log(err);
	return console.log("Saved");
	});
	
});


// ---------------------------------------------
// Route to delete data in database
// ---------------------------------------------
router.post('/delete', isLoggedIn, function(req, res){

	var deleteInput = req.body;
	//updateInput.email = req.user.local.email;
	console.log(deleteInput._id);
	MetamooSchema.remove( { _id: deleteInput._id }, function(err, result){
	if (err) return console.log(err);
	return console.log("Deleted");
	});


});

// ===================================================================
// AUTHENTICATE (FIRST LOGIN)
// ===================================================================

	// locally -----------------------------------------------------------
		// SHOW LOGIN FORM
		router.get('/login', function(req,res){

		// Checking for chrome browser on desktop
		ua = req.headers['user-agent'];
		if( /chrome/i.test(ua) )
			res.render('login', { message: req.flash('loginMessage') }); 
		else
			res.render('chromeinstall');
		
		//res.render('login', { user: req.user });
		});

		// PROCESS LOGIN INFO
		router.post('/login', passport.authenticate('local-login',{
		// process login form here
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
		}));

		// SHOW SIGNUP FORM
		router.get('/signup',function(req,res){
		
		ua = req.headers['user-agent'];
			if( /chrome/i.test(ua) )
  			res.render('signup',{message: req.flash('signupMessage')  }); 
			else
  			res.render('chromeinstall');
			
		});

		// PROCESS SIGNUP INFO
		router.post('/signup',passport.authenticate('local-signup', {
		successRedirect : '/thankyou',
		failureRedirect : '/signup',
		failureFlash : true
		}));
		


	// Twitter -------------------------------------------------------------
		// SEND TO Twitter for authentication and login
		router.get('/auth/twitter', passport.authenticate('twitter'));

		// Handle the CALLBACK after twitter has authenticated the user
		router.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
		}));


	// Google Routes --------------------------------------------------------

		// SEND TO Google for authentication and login
		router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
		
		// Handle the callback after google has authenticated the user
		router.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// ========================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
// ========================================================================

	// locally ----------------------------------------------------------------
	router.get('/connect/local', function(req,res){
		res.render('connect-local.ejs',{ message: req.flash('loginMessage') });
	});
	router.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile', //redirect to secure profile section
		failureFlash : '/connect/local', // redirect back to signup page if err
		failureFlash : true // allow flash messages

	}));

	// Twitter
	
		// send to twitter to do the authentication
		router.get('/connect/twitter', passport.authorize('twitter',{ scope :  'email' }));

		// handle the callback after twitter has authorized the user
		router.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// Google
		// send to Google to do the authentication
		router.get('/connect/google', passport.authorize('google',{ scope :  ['profile', 'email'] }));

		// handle the callback after twitter has authorized the user
		router.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

   // local -----------------------------------
    router.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

   // twitter --------------------------------
    router.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

   // google ---------------------------------
    router.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });


router.get('/ping', function(req, res){
	if(req.user == undefined)
	res.send( {loggedIn : false});
	
	res.send( {loggedIn : true});
});


// Route middleware to ensure user is logged in
function isLoggedIn(req, res, next){

	//if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	//if they aren't redirect them to home page
	res.redirect('/');
};


module.exports = router;
