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

// Below code takes "val" as input and outputs "data" which is an object
// array that contains objects that have matching tags. 
var objects = [];
var obj = appdata;
for (var i in obj) {
    //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    if (obj[i].tag == val) { //
        objects.push(obj[i]);
    } 
}
var data = objects;

 res.send(data);

});


module.exports = router;
