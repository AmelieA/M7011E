var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var app = require('../app');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.checkUser = function(FirstName, LastName, GoogleID){
	var exist = false;
	var ban = false;
	pg.connect(dbURL, function(err, client){      
		client.query("SELECT * FROM Users", function(err, result) {
			for (var i = 0; i < result.rows.length; i++) {
				console.log(result.rows[i].googleid,GoogleID)
				if (result.rows[i].googleid == GoogleID){
					exist = true;
					ban = result.rows[i].banned
				}
			}
			
		})
		if (!exist){
			//~ console.log(FirstName, LastName, GoogleID);
			client.query("INSERT INTO Users(firstName, lastName, googleID, banned) VALUES('"+FirstName+"', '"+LastName+"', '"+GoogleID+"', false)");
			console.log("adding "+FirstName+" into the database");
		
		}
	})
	return(ban);
	
};
