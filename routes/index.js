var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'VISA' });
};


exports.mapbox = function(req, res){
  res.sendfile('views/mapbox.html');
};

exports.addpin = function(req, res)
{
	var params = querystring.parse(url.parse(req.url).query)
	
	if ('name' in params && 'x' in params && 'y' in params && 'comment' in params && 'login' in params) 
	{
		pg.connect(dbURL, function(err, client) {
			client.query("INSERT INTO Locations(location, x, y, img_name) VALUES($1, $2, $3, $4)",[params['name'], params['x'], params['y'], "null"]);
			client.query("INSERT INTO Comments(location, text, login) VALUES($1, $2, $3)",[params['name'], params['comment'], "default_user"]);
			console.log("Added : name = " + params['name'] + ", x = " + params['x'] + ", y = " + params['y'] + ", comment = " + params['comment'] + ", login = " + params['login']);
		})
    }
    else {
        console.log('Error : invalid request');
    }
    
  res.sendfile('views/mapbox.html');
};
