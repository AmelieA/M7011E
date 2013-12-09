var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var app = require('../app');

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
			var createComment = 1;	
			var createLocation = 1;
			
			
			//Adding a new location
			if ('name' in params && 'x' in params && 'y' in params && 'comment' in params && 'login' in params) {        
				pg.connect(dbURL, function(err, client, done){      
					client.query("SELECT * FROM Locations", function(err, result) {
						for (var i = 0; i < result.rows.length; i++) {
							var row = result.rows[i];
							if (row.location==params['name']) 
							{
								createLocation=0;
								client.query("SELECT * FROM Locations", function(err, result) {
									for (var j = 0; j < result.rows.length; i++) {
										if((result.rows[j].location==params['name'])&&(result.rows[j].text==params['comment'])){
											createComment=0;
											console.log("already exist");
										}
									}
								});
							}
						}
						
						if (createLocation){
							client.query("INSERT INTO Locations(location, x, y, img_name) VALUES($1, $2, $3, $4)",[params['name'], params['x'], params['y'], "null"],function(err, result) {
								if(err) {
									return console.error('error running query', err);
								}else{
									console.log("adding Locations("+params['name']+", "+ params['x']+", "+params['y']+", "+ "null");	
								}
								if(result){
									console.log(result);
								}
							});
						}if (createComment){
							client.query("INSERT INTO Comments(location, text, login) VALUES($1, $2, $3)",[params['name'], params['comment'], params['login']],function(err, result) {
								if(err) {
									return console.error('error running query', err);
								}else{
									console.log("Adding Comments("+params['name']+", "+ params['comment']+", "+ params['login']+")");
								}
								if(result){
									console.log(result);
								}
							});
							
						}else{
							console.log("request already saved.");
						}
						done();
					})
				});
			}
		}
			else 
			{
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
