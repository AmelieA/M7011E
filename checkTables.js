var pg = require('pg').native;

var dbURL = "tcp://nodetest:pika@localhost/dbtest";

function checkTables() 
{
	
		pg.connect(dbURL, 	function(err, client, done) {      
							client.query("SELECT * FROM Users",	function(err, result) {
								console.log("\n ----- \n Users \n ----- \n Row count: %d \n",result.rows.length);
								for (var i = 0; i < result.rows.length; i++) {
									console.log(result.rows[i]);
									//~ var row = result.rows[i];
									//~ console.log("fisrt name : " + row.firstName);
									//~ console.log("last name : " + row.lastName);
									//~ console.log("google ID : " + row.googleID);
									//~ console.log("banned ? : " + row.banned);
								}
								done();
								if(err) {return console.error(err);}
						})

		});	
						
		pg.connect(dbURL, 	function(err, client, done) 
						{      
							client.query("SELECT * FROM Locations", function(err, result) {
								console.log("\n ----- \n Locations \n ----- \n Row count: %d \n",result.rows.length);
								for (var i = 0; i < result.rows.length; i++) {
									var row = result.rows[i];
									console.log("location: " + row.location);
									console.log("x: " + row.x);
									console.log("y: " + row.y + "\n");
								}
								done();
								if(err) {return console.error(err);}
							})

						});
						
		pg.connect(dbURL, 	function(err, client, done) {      
			client.query("SELECT * FROM Comments", 	function(err, result) {
				console.log("\n ----- \n Comments \n ----- \n Row count: %d \n",result.rows.length);
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows[i];
					console.log("location: " + row.location);
					console.log("text: " + row.text);
					console.log("date: " + row.date);
					console.log("login: " + row.login + "\n");
				}
				done();
				if(err) {return console.error(err);}
			})
		});
		
			pg.connect(dbURL, function(err, client, done) {      
				client.query("SELECT * FROM Images", function(err, result) {
					console.log("\n ----- \n Images \n ----- \n Row count: %d \n",result.rows.length);
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows[i];
						console.log("location: " + row.location);
						console.log("img_name: " + row.img_name);
						console.log("login: " + row.login);
						console.log("date: " + row.date + "\n");
					}
					done();
					if(err) {return console.error(err);}
				})
			});		
		
		
}
checkTables();
pg.end();
