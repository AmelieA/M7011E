var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

function createTables() {
    pg.connect(dbURL, function(err, client, done) {
		client.query("CREATE TABLE Users(firstName VARCHAR(255), lastName VARCHAR(255), googleID VARCHAR(255) PRIMARY KEY, banned BOOL)");
		client.query("CREATE TABLE Locations(location VARCHAR(255) PRIMARY KEY, x REAL NOT NULL, y REAL NOT NULL, img_name VARCHAR(255))");
		client.query("CREATE TABLE Comments(location VARCHAR(255) REFERENCES Locations(location), text VARCHAR(255), login VARCHAR(255), date VARCHAR(255))");
		client.query("CREATE TABLE Images(location VARCHAR(255) REFERENCES Locations(location), img_name VARCHAR(255), login VARCHAR(255), date VARCHAR(255))", function(err) {
			done();
			if(err) {return console.error(err);}
		});
	})
}
createTables();
console.log("Tables Created.");
pg.end();

