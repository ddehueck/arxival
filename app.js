var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Dotenv = require('dotenv').config()

var index = require('./routes/index');
var user = require('./routes/user');
var papers = require('./routes/papers');
var subjects = require('./routes/subjects');
var search = require('./routes/search');

var mongoose = require('mongoose');
	var connection_url = 'mongodb://';

	if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PSWD) {
		connection_url += process.env.DB_USER + ':';
		connection_url += process.env.DB_PSWD + '@localhost/';
		connection_url += process.env.DB_NAME;
	} else {
		connection_url += 'localhost:27017/arxival-test';
	}
	console.log(connection_url);
	mongoose.connect(connection_url, {auth:{authdb:"admin"}});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	if (process.env.NODE_ENV != 'production') {
		console.log('Connected to DB');
	}
});

var app = express();

// Session middleware
var sessionSecret = '53qS4aDGS5078hefFD7alI';

if (process.env.NODE_ENV == 'production') {
	sessionSecret = process.env.SESSION_SECRET;
}
var sess = {
  secret: sessionSecret,
  cookie: {maxAge: 5184000},
  resave: false,
  saveUninitialized: true,
}

app.use(session(sess));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/papers', papers);
app.use('/subjects', subjects);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
