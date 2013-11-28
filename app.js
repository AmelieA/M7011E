
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

app.get('/', routes.mapbox);
app.get('/mapbox/*', routes.connected);
app.get('/mapbox*', routes.mapbox);
app.get('/users', user.list);

app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
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
    res.redirect('/mapbox/'+req.user.displayName);
  });

app.get('/logout', function(req, res){
  req.logout();
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
