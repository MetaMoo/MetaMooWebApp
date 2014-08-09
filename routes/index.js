var express = require('express');
var router = express.Router();
var appdata = require('../metamoo_data.json');
var MetamooSchema = require('../schemas/metamoo');

/* GET home page. */
router.get('/', function(req, res) {

	// test data
	//var snippets = [{content: "Test snippet of data", tag: "#awesome"},{content: "Test 2 snippet of data", tag: "#cool"}];

  res.render('index', {title: 'Home'});
});

/* GET search results page. */
router.get('/searching', function(req, res) {

	// test data
	//var snippets = [{content: "Test snippet of data", tag: "#awesome"},{content: "Test 2 snippet of data", tag: "#cool"}];

 var val = req.query.search;
 res.send(val);
 //console.log(val);

});


module.exports = router;
