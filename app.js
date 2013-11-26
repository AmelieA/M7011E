
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

var app = express();
var server = http.createServer(app);

var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

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
app.use(app.router);
//~ app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/mapbox', routes.mapbox);
app.get('/users', user.list);
app.get('/login', user.login);

  
app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});

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
