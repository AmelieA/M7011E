var pg = require('pg').native;

var dbURL = "tcp://nodetest:pika@localhost/dbtest";

function checkTables() 
{
	
/*		pg.connect(dbURL, 	function(err, client) 
						{      
							client.query("SELECT * FROM Users",			function(err, result) 
																		{
																			console.log("\n ----- \n Users \n ----- \n Row count: %d \n",result.rows.length);
																			for (var i = 0; i < result.rows.length; i++) 
																			{
																				var row = result.rows[i];
																				console.log("login: " + row.login);
																				console.log("password: " + row.password);
																			}
																		})
						});	*/
						
		pg.connect(dbURL, 	function(err, client) 
						{      
							client.query("SELECT * FROM Locations", 	function(err, result) 
																		{
																			console.log("\n ----- \n Locations \n ----- \n Row count: %d \n",result.rows.length);
																			for (var i = 0; i < result.rows.length; i++) 
																			{
																				var row = result.rows[i];
																				console.log("location: " + row.location);
																				console.log("x: " + row.x);
																				console.log("y: " + row.y + "\n");
																//				console.log("img_name: " + row.img_name + "\n");
																			}
																		})
						});
						
		pg.connect(dbURL, 	function(err, client) 
						{      
							client.query("SELECT * FROM Comments", 		function(err, result) 
																		{
																			console.log("\n ----- \n Comments \n ----- \n Row count: %d \n",result.rows.length);
																			for (var i = 0; i < result.rows.length; i++) 
																			{
																				var row = result.rows[i];
																				console.log("location: " + row.location);
																				console.log("text: " + row.text);
																				console.log("login: " + row.login + "\n");
																			}
																		})
						});
		
			pg.connect(dbURL, 	function(err, client) 
						{      
							client.query("SELECT * FROM Images", 		function(err, result) 
																		{
																			console.log("\n ----- \n Images \n ----- \n Row count: %d \n",result.rows.length);
																			for (var i = 0; i < result.rows.length; i++) 
																			{
																				var row = result.rows[i];
																				console.log("location: " + row.location);
																				console.log("img_name: " + row.img_name);
																				console.log("login: " + row.login + "\n");
																			}
																		})
						});		
		
		
}
checkTables();
pg.end();
