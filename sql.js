/* EXECUTE THIS BEFORE LAUNCHING THE APPLICATION :
 * 
 * INSTALLATION :
 * sudo add-apt-repository ppa:pitti/postgresql
 * sudo apt-get update
 * sudo apt-get install postgresql-9.2
 * 
 * DATABASE CREATION :
 * sudo -u postgres createuser nodetest
 * sudo -u postgres createdb -O nodetest dbtest
 * sudo -u postgres dropdb dbtest
 * 
 * NB : the password of nodetest is 'pika'
 */

//Use the native libpq bindings
var pg = require('pg').native;

var dbUrl = "tcp://nodetest:pika@localhost/dbtest";

function disconnectAll() {
    pg.end();
}

function testTable() {
	
    pg.connect(dbUrl, function(err, client) {
		
		client.query("CREATE TEMP TABLE Users(login VARCHAR(255) PRIMARY KEY, password VARCHAR(255))");
		client.query("CREATE TEMP TABLE Locations(location VARCHAR(255) PRIMARY KEY, x INT NOT NULL, y INT NOT NULL, img_name VARCHAR(255))");
		client.query("CREATE TEMP TABLE Comments(location VARCHAR(255) REFERENCES Locations(location), text VARCHAR(255), login VARCHAR(255) REFERENCES Users(login) )");
      
       client.query("INSERT INTO Users(login, password) VALUES($1, $2)",["Bob", "bob's password"]);
       client.query("INSERT INTO Locations(location, x, y, img_name) VALUES($1, $2, $3, $4)",["LTU", 126, 127, "ltu.png"]);
       client.query("INSERT INTO Locations(location, x, y, img_name) VALUES($1, $2, $3, $4)",["Väderleden", 1138, 957, "vaderleden.png"]);
       client.query("INSERT INTO Comments(location, text, login) VALUES($1, $2, $3)", ["Väderleden", "c'est ici que j'habite", "Bob"]);
        
        
/*        client.query("SELECT * FROM Users", function(err, result) {	//pour afficher le contenu de la table Users
            console.log("Row count: %d \n ",result.rows.length);
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                console.log("login: " + row.login);
                console.log("password: " + row.password + "\n);
            }*/
            
/*          client.query("SELECT * FROM Locations", function(err, result) {	//pour afficher le contenu de la table Locations
            console.log("Row count: %d \n",result.rows.length);
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                console.log("location: " + row.location);
                console.log("x: " + row.x);
                console.log("y: " + row.y);
                console.log("img_name: " + row.img_name + "\n");
            }*/
            
            client.query("SELECT * FROM Comments", function(err, result) {	//pour afficher le contenu de la table Comments
            console.log("Row count: %d \n",result.rows.length);
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                console.log("location: " + row.location);
                console.log("text: " + row.text);
                console.log("login: " + row.login +"\n");
            }

        });
    });
}

testTable();

/*testDate((function() {
    testTable(disconnectAll)
}));*/

