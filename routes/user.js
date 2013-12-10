var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var app = require('../app');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.sendfile('views/Users.html');
  app.io.sockets.on('connection', function (socket) {
		pg.connect(dbURL, function(err, client, done) {      
			client.query("SELECT * FROM Users", function(err, result) {
				//~ console.log(result);
				socket.emit('displayUsers', result);
				done();
				});
			});
		socket.on('AskForBan',function (data) {
			console.log("ask for ban");
			pg.connect(dbURL, 	function(err, client, done) {
				for (var i=0; i<data.banIDs.length; i++){
					console.log(data.banIDs[i]);
					client.query("UPDATE Users SET banned = 'true' WHERE googleid = '"+data.banIDs[i]+"';", function(err, result) {
						console.log("ban of "+data.banIDs[i]);
						done();
					});
				}
			});
		});
		socket.on('AskForUnBan',function (data) {
			console.log("ask for unban");
			pg.connect(dbURL, 	function(err, client, done) {
				for (var i=0; i<data.banIDs.length; i++){
					//~ console.log(data.banIDs[i]);
					client.query("UPDATE Users SET banned = 'false' WHERE googleid = '"+data.banIDs[i]+"';", function(err, result) {
						console.log("unban of "+data.banIDs[i]);
						done();
					});
				}
			});
		});
	});
	//~ res.redirect("/users");
};

exports.checkUser = function(req, res, userName){
	var exist = false;
	var ban = false;
	var FirstName = req.user.name.givenName;
	var LastName = req.user.name.familyName;
	var GoogleID = req.user.id;
	pg.connect(dbURL, function(err, client){      
		client.query("SELECT * FROM Users", function(err, result) {
			for (var i = 0; i < result.rows.length; i++) {
				//~ console.log(result.rows[i].googleid,GoogleID);
				//~ console.log(result.rows[i].googleid.localeCompare(GoogleID));
				if (result.rows[i].googleid.localeCompare(GoogleID)==0){
					exist = true;
					ban = result.rows[i].banned
				}
			}
			if (!exist){
			console.log("adding "+FirstName+" into the database");
			client.query("INSERT INTO Users(firstName, lastName, googleID, banned) VALUES('"+FirstName+"', '"+LastName+"', '"+GoogleID+"', false)");
		
			}else{
				console.log(FirstName+" is already in the database");
			}
			console.log("ban "+ban);
			
			if(!ban){
				console.log("redirected to mapbox");
				res.redirect('/mapbox/'+userName);
			}else{
				console.log("redirected to logout");
				res.redirect('/logout/');
			}
		})
		
	})
	
};
