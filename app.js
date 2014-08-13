var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');


//var routes = require('./routes/index'); //default index route
var routes = require('./routes'); //default index route

var mongoose = require('mongoose'); //installed with passport
var passport = require('passport'); //installed with passport
var LocalStrategy = require('passport-local').Strategy; //installed with passport
var flash = require('connect-flash');

var app = express();
var db = require('./db');
require('./config/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(session({secret : 'keyboard cat', resave: true, saveUninitialized: true})); //installed while setting up passport

app.use(passport.initialize()); //installed while setting up passport
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride()); //installed while setting up passport
app.use(cookieParser());

//app.use(app.router); //installed while setting up passport
app.use(express.static(path.join(__dirname, 'public')));

// Pulling in stuff from the metamoo_data file
// note this does not put appdata in routes
//app.locals.appdata = require('./metamoo_data.json'); 

app.use(flash());

app.use('/', routes);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
