/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var html=require('html');
var net = require('net');

var express = require('express')
var passport = require('passport')
var util = require('util')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GOOGLE_CLIENT_ID = "318906858005.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "P7Do-uqh9H8rKZaz2me3UKKU";

var app = express();
var server = http.createServer(app);

var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var io = require('socket.io').listen(server);
exports.io=io;

var loggedIn=1;
var invalidLocation =0;
var name="null";

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', notLoggedIn);
//app.get('/mapbox/*', routes.connected);
app.get('/mapbox/*', userAllowed);
app.get('/mapbox*', notLoggedIn);
app.get('/users', user.list);

app.use(function(req, res, next){
  res.send(404, 'Sorry can\'t find that!');
});

function notLoggedIn(req,res){
	routes.mapbox(req,res);
//	console.log("User is not logged-in");
	loggedIn=0;
}

function userAllowed(req,res){
//	console.log("User is logged-in and is allowed to perform actions.");
//	console.log("x=%d , y=%d", querystring.parse(url.parse(req.url).query)['x'], querystring.parse(url.parse(req.url).query)['y']);
	if ( (querystring.parse(url.parse(req.url).query)['x']>85.05113063088963) || (querystring.parse(url.parse(req.url).query)['x']<-60.00002146881433) || (querystring.parse(url.parse(req.url).query)['y']>195.7763671875) || (querystring.parse(url.parse(req.url).query)['y']<-199.3359375) ) {
		//The new location must not be placed off-limits the map !
		//console.log("Invalid location !");
		routes.mapbox(req,res);
		invalidLocation=1;
	}
	else {
		routes.connected(req,res);
	}
	
	name = url.parse(req.url).pathname.substring(8,url.parse(req.url).pathname.length);
	
	
}


/* -------------------Socket part ------------------------*/

io.sockets.on('connection', function (socket) {
	
//	console.log('CLIENT CONNECTED !!!!!!!!!');
	
	if (loggedIn==0) {
		socket.emit('notLoggedIn');
		loggedIn=1;
	}
	
	if (invalidLocation==1) {
		socket.emit('cantPlaceLocation');
		invalidLocation=0;
	}
	
	socket.emit('sendLogin', name);
	
	//sending the pins
	pg.connect(dbURL, 	function(err, client, done) {      
		client.query("SELECT * FROM Locations", function(err, result) {
			socket.emit('display', result);
			done();
			if(err) {return console.error(err);}
			});
		});
	
	//displaying the comments for the user	
	socket.on('AskForComment',function (data) {
		pg.connect(dbURL, function(err, client, done) {
			client.query("SELECT * FROM Comments WHERE location='"+data.location+"' ", function(err, result) {
				socket.emit('displayComments', result);
				done();	
				if(err) {return console.error(err);}			
			});
		});
	});
	
	//sending the images
	socket.on('AskForImages', function (data) {
		pg.connect(dbURL, function(err, client, done) {
			client.query("SELECT * FROM Images WHERE location='"+data.location+"' ", function(err,result) {
				dirname = __dirname;
//				console.log('dirname = ' + __dirname);
				socket.emit('displayImages', result);
				done();
				if(err) {return console.error(err);}
			});
		});
	});
	
	
/*	socket.on('disconnect', function(){
		console.log('CLIENT DISCONNECTED !!!!!!!!!');
	});	*/
	
	
});	


/* -------------------Google Authentication ------------------------*/
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  function(req, res) {
	var userName = decodeURI(req.user.displayName);
	//~ console.log("---------------------->",req.user);
	var banned = user.checkUser(req, res,userName);
	//~ console.log("banned = ",banned);
		//~ if(!banned){
			//~ res.redirect('/mapbox/'+userName);
		//~ }else{
			//~ res.redirect('/logout/'+userName);
		//~ }
  });

app.get('/logout', function(req, res){
  req.logout();
  req.user = undefined;  
  res.redirect('/mapbox');
});

/* -------------------End of Google Authentication ------------------------*/

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  address = server.address();
  console.log("Express server listening on %j", address);
});

var client = net.connect({port: app.get('port')},function() { //'connect' listener
  server.getConnections(function(err, count){
	console.log('There is '+count+' user connection');
	});
});
