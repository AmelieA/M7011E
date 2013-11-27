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


exports.mapbox = function(req, res)
{
	var user = req.params.user;
	var params = querystring.parse(url.parse(req.url).query)
	var already_exists = 0;
	
	
	
	if ('name' in params && 'x' in params && 'y' in params && 'comment' in params && 'login' in params) 
	{	
		pg.connect(dbURL, 	function(err, client)
							{      
								client.query("SELECT * FROM Locations", 					function(err, result) 
																		{
																			for (var i = 0; i < result.rows.length; i++) 
																			{
																				var row = result.rows[i];
																				if (row.location==params['name']) 
																				{
																					already_exists=1;
																				}

																			}
																			
																			if (already_exists==0)
																			{											
																				client.query("INSERT INTO Locations(location, x, y, img_name) VALUES($1, $2, $3, $4)",[params['name'], params['x'], params['y'], "null"]);
																				client.query("INSERT INTO Comments(location, text, login) VALUES($1, $2, $3)",[params['name'], params['comment'], "default_user"]);
																				console.log("Added : name = " + params['name'] + ", x = " + params['x'] + ", y = " + params['y'] + ", comment = " + params['comment'] + ", login = " + params['login']);


																			}
																			else
																			{
																				console.log("Can't add location : it already exists.");
																			}
																		})
							});
    }
    else 
    {
        console.log('Error : invalid request');
    }
	res.sendfile('views/mapbox.html'); //{user: 'user'}

};
