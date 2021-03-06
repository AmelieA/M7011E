var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var app = require('../app');
exports.noLocationSelected=0;

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'VISA' });
};


exports.connected = function(req, res)
{	
	if (req.user != undefined){
		if (("/mapbox/"+req.user.displayName) == decodeURI(url.parse(req.url).pathname)){ //so that people don't send message under an other name
			var user = req.params.user;
			var params = querystring.parse(url.parse(req.url).query)
			var already_exists = 0;	
			
			
			//Adding a new location
			if ('name' in params && 'x' in params && 'y' in params && 'comment' in params && 'login' in params) {
				if ( (params['x']!="null") || (params['y']!="null") ) {					       
					pg.connect(dbURL, function(err, client, done){      
						client.query("SELECT * FROM Locations", function(err, result) {
							for (var i = 0; i < result.rows.length; i++) {
								var row = result.rows[i];
								if (row.location==params['name']) 
								{
									already_exists=1;
									//~ client.query("SELECT * FROM Locations", function(err, result) {
										//~ for (var j = 0; j < result.rows.length; i++) {
											//~ if((result.rows[j].location==params['name'])&&(result.rows[j].text==params['comment'])){
												//~ already_exists=1;
											//~ }
										//~ }
									//~ });
								}
							}
							
							if (already_exists==0)
							{                                                                                        
								client.query("INSERT INTO Locations(location, x, y) VALUES($1, $2, $3)",[params['name'], params['x'], params['y']]);
								var d=new Date();
								client.query("INSERT INTO Comments(location, text, login, date) VALUES($1, $2, $3, $4)",[params['name'], params['comment'], params['login'], d.toString()]);
								console.log("Added : name = " + params['name'] + ", x = " + params['x'] + ", y = " + params['y'] + ", comment = " + params['comment'] + ", login = " + params['login']);
							}
							//Adding a comment
							else 
							{
								var d=new Date();
								client.query("INSERT INTO Comments(location, text, login, date) VALUES($1, $2, $3, $4)",[params['name'], params['comment'], params['login'], d.toString()]);
							//	console.log("Comment added");
							}
							done();
							if(err) {return console.error(err);}
						})
					});
				}
				else {
					res.sendfile('views/mapbox.html');
					noLocationSelected=1;
				}
			}
		}
		else {
			console.log('Not an add request');
		}

			res.setHeader("Content-Type", "text/html");
			res.sendfile('views/mapbox.html');
	}else{
		res.redirect("/mapbox");
	}
};

exports.mapbox = function(req, res){
	res.sendfile('views/mapbox.html');
};
