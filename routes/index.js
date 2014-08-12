var express = require('express');
var router = express.Router();
var passport = require('passport');
//var appdata = require('../metamoo_data.json');

//MetamooSchema object is a chainable object that we can use to build a query
var MetamooSchema = require('../schemas/metamoo'); 
var Account = require('../schemas/account');

/* GET home page. */
router.get('/', function(req, res) {
  		res.render('index', {user : req.user});
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

router.get('/register',function(req,res){
	res.render('register',{ });
});

router.post('/register',function(req,res){
	Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account){
		if (err) {
			return res.render('register', {account : account});
		}

		passport.authenticate('local')(req, res, function(){
			res.redirect('/');
		});
	});
});

router.get('/login', function(req,res){
	res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/');
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/ping', function(req,res){
	res.send("pong!", 200);
});


module.exports = router;
