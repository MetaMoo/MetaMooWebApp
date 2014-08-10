var express = require('express');
var router = express.Router();
//var appdata = require('../metamoo_data.json');

//MetamooSchema object is a chainable object that we can use to build a query
var MetamooSchema = require('../schemas/metamoo'); 

/* GET home page. */
router.get('/', function(req, res) {

  res.render('index', {title: 'Home'});
});

/* GET search results page. You get to this page from typing in something
in the search bar and then hitting enter (see jQuery script in /javascripts/main.js*/ 
router.get('/searching', function(req, res) {

	var val = req.query.search;

	MetamooSchema.find({ tag: val }).exec(function (err, docs) { 
		if (err) throw err; 
		data = docs; 
		res.send(data);
	});	

});


module.exports = router;
