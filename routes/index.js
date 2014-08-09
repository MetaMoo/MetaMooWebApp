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

// need to include some function here that takes "val" as input and outputs 
// all the objects from metamoo_data.json into a variable called "data"

var data = [
  {
    "content": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.",
    "tag": "one",
    "note": "Maecenas pulvinar lobortis est. Phasellus sit amet erat.",
    "date": "7/20/2014",
    "source": "sakura.ne.jp"
  },
  {
    "content": "Nulla justo.",
    "tag": "two",
    "note": "In blandit ultrices enim.",
    "date": "4/6/2014",
    "source": "mtv.com"
  },
  {
    "content": "Pellentesque ultrices mattis odio. Donec vitae nisi.",
    "tag": val,
    "note": "Nam dui.",
    "date": "6/1/2014",
    "source": "who.int"
  }];

 //search val against appdata
 res.send(data);

 //console.log(val);

});


module.exports = router;
