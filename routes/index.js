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
  	res.render('about');
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
// Landing page if you are already logged in
// ---------------------------------------------
router.get('/homeLoggedIn', isLoggedIn, function(req, res) {
  	res.render('homeLoggedIn',{ message: req.flash('loginMessage') });
  	//res.render('index', {user : req.user});
});

router.get('/thankyou', isLoggedIn, function(req, res) {
  	res.render('thankyou', {user : req.user});
});

router.get('/google5fb9705d1f3fcf75.html', function(req, res) {
  	res.render('googleverification');
  	//res.render('index', {user : req.user});
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


// var snippet = new MetamooSchema();
// snippet.content = req.body.content;
// snippet.tag = req.body.tag;
// snippet.note = req.body.note;
// snippet.source = req.body.source;
// snippet.date = req.body.date;

// snippet.save(function(err){
// 	if (err)
// 		res.send(err);
// 	res.json({message: 'snippet created'});
// });

});

// ===================================================================
// AUTHENTICATE (FIRST LOGIN)
// ===================================================================

	// locally -----------------------------------------------------------
		// SHOW LOGIN FORM
		router.get('/login', function(req,res){

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
		successRedirect : '/profile',
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
}


module.exports = router;
