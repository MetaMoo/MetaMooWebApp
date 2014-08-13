var express = require('express');
var router = express.Router();
var passport = require('passport');
//var appdata = require('../metamoo_data.json');

//MetamooSchema object is a chainable object that we can use to build a query
var MetamooSchema = require('../schemas/metamoo'); 
//var Account = require('../schemas/account');

/* GET home page. */
router.get('/', function(req, res) {
  	res.render('home',{ message: req.flash('loginMessage') });
  	//res.render('index', {user : req.user});
});

/* GET search results page. 
You get to this page from typing in something
in the search bar and then hitting enter (see jQuery script in /javascripts/main.js*/ 
router.get('/searching', function(req, res) {
	var val = req.query.search;
	MetamooSchema.find({ tag: val }).exec(function (err, docs) { 
		if (err) throw err; 
		data = docs; 
		res.send(data);
	});	
});

router.post('/chromeplugin',function(req, res){
// So Chromeplugin can push data
// Need to figure out how to handle req. sent as a json.
// push to db
});

router.get('/signup',function(req,res){
	res.render('signup',{message: req.flash('signupMessage')  });
});

router.post('/signup',passport.authenticate('local-signup', {
	successRedirect : '/profile',
	failureRedirect : '/signup',
	failureFlash : true
}));
	
	// Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account){
	// 	if (err) {
	// 		return res.render('signup', {account : account});
	// 	}

	// 	passport.authenticate('local')(req, res, function(){
	// 		res.redirect('/');
	// 	});
	// });

router.get('/login', function(req,res){
	res.render('login', { message: req.flash('loginMessage') });
	//res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local-login',{
	// process login form here
	successRedirect : '/profile',
	failureRedirect : '/login',
	failureFlash : true
}));

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

/* GET Main search page. */
router.get('/profile', isLoggedIn, function(req, res) {
  	res.render('index', {user : req.user});
});

router.get('/ping', function(req,res){
	res.send("pong!", 200);
});

function isLoggedIn(req, res, next){

	//if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	//if they aren't redirect them to home page
	res.redirect('/');
}


module.exports = router;
